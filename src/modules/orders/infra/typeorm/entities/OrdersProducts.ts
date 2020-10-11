import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  public order: Order;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @Column('uuid')
  public product_id: string;

  @Column('uuid')
  public order_id: string;

  @Column('decimal', { precision: 9, scale: 2 })
  public price: number;

  @Column('int', { nullable: false })
  public quantity: number;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}

export default OrdersProducts;
