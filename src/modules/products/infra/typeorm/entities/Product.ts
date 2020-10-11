import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { nullable: false })
  public name: string;

  @Column('decimal', { precision: 9, scale: 2 })
  public price: number;

  @Column('int', { nullable: false })
  public quantity: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => OrdersProducts, productToOrder => productToOrder.product)
  public order_products: OrdersProducts[];

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}

export default Product;
