import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class OrdersRepository extends BaseRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) orderModel: Model<OrderDocument>) {
    super(orderModel);
  }
}
