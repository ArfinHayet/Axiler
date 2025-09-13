 import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  note: string;

  @Prop()
  status: string;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      productImage: { type: String },
      quantity : {type : Number },
      price : { type : Number }
    },
  ])
  products: { productId: Types.ObjectId; productName: string }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
