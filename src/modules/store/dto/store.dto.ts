import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class StoreResponse {
  success: boolean;
  data: any;
}

export class AddProduct {
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

  @IsNotEmpty()
  @IsString()
  countryId: string;
}

export class UpdateProduct {
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
  @IsNotEmpty()
  @IsString()
  countryId: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
