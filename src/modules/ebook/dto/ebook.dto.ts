import { User } from 'src/modules/user/entity/user.entity';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class EbookResponse {
  success: boolean;
  data: any;
}
export class AddEbook {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  pdf: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  topic: string;
}
export class UpdateEbook {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  details: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class AddToCart {
  user: User;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class DeleteCart {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateOrder {
  user: User;

  @IsOptional()
  @IsString()
  couponCode: string;

  @IsOptional()
  @IsString()
  salesCode: string;
}
