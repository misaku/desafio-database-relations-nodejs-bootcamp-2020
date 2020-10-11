import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();
    const order_products = products.map(product => {
      const orderProducts = new OrdersProducts();
      Object.assign(orderProducts, {
        ...product,
      });
      return orderProducts;
    });

    Object.assign(order, {
      customer,
      order_products,
    });
    const oderData = this.ormRepository.create(order);
    return this.ormRepository.save(oderData);
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });
  }
}

export default OrdersRepository;
