import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) userModel: Model<ProductDocument>) {
    super(userModel);
  }
}
