import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    required: true,
    default: 'Sample product',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category id',
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Description of the product',
    required: true,
    default: 'Description of the product',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    required: true,
    default: 20,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'quantity of the product',
    required: true,
    default: 20,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'isBestSeller of the product 1/0',
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  isBestSeller: number;

  @ApiProperty({
    description: 'star of the product 1-5',
    required: true,
    default: 1,
  })
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  star: number;

  @ApiProperty({
    description: 'discount of the product ',
    required: true,
    default: 1,
  })
  @Max(100)
  @Min(0)
  @IsNotEmpty()
  discount: number;

  @ApiProperty({
    description: 'image url for the product',
    required: true,
    default: ['image'],
  })
  @IsNotEmpty()
  @IsArray()
  images: string[];
}
