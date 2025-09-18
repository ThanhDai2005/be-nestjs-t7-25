import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product extends CoreEntity {
  @Index()
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column()
  quantity: number;

  @Column({
    default: false,
  })
  isBestSeller: boolean;

  @Column()
  star: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  totalSold: number;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];
}
