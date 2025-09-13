import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { OrdersRepository } from './entity/order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entity/order.schema';
import { OrderGateway } from './orders.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),KafkaModule],
  providers: [OrdersService,OrdersRepository,OrderGateway],
  controllers: [OrdersController]
})
export class OrdersModule {}
 