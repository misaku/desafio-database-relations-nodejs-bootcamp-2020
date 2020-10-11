import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => OrdersProducts, productToOrder => productToOrder.order, {
    cascade: true,
  })
  public order_products: OrdersProducts[];

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}

export default Order;
