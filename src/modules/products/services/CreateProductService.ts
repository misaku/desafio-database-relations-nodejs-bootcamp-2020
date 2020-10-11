import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const hasProduct = await this.productsRepository.findByName(name);
    if (hasProduct) {
      throw new AppError('Produto existente', 400);
    }
    const product = new Product();
    Object.assign(product, {
      name,
      price,
      quantity,
    });
    return this.productsRepository.create(product);
  }
}

export default CreateProductService;
