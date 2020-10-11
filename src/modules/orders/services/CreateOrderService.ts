import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import AppError from '@shared/errors/AppError';
import { IProduct as IProductOrder } from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customer_id,
    products: productsPayload,
  }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Cliente não existe', 400);
    }
    const productsData = await this.productsRepository.findAllById(
      productsPayload.map(product => ({
        id: product.id,
      })),
    );
    if (!productsData || productsData.length < productsPayload.length) {
      throw new AppError('Produto inválido', 400);
    }
    const products = productsData.map(product => {
      const findProduct = productsPayload.find(
        productFinder => productFinder.id === product.id,
      );
      if (findProduct === undefined) {
        throw new AppError('Produto inválido');
      }
      if (findProduct.quantity > product.quantity) {
        throw new AppError('Produto insuficiente');
      }
      const newProduct: IProductOrder = {
        product_id: findProduct.id,
        price: product.price,
        quantity: findProduct.quantity,
      };
      return newProduct;
    });
    const newOrder = await this.ordersRepository.create({ customer, products });
    await this.productsRepository.updateQuantity(
      productsData.map(product => ({
        id: product.id,
        quantity:
          product.quantity -
          (productsPayload.find(
            productPayload => productPayload.id === product.id,
          )?.quantity || 0),
      })),
    );
    return newOrder;
  }
}

export default CreateOrderService;
