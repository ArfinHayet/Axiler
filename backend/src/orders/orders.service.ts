import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entity/order.schema';
import { OrdersRepository } from './entity/order.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepo: OrdersRepository) {}

  // Find all orders
  async findAll(options?: object) {
    return this.orderRepo.findAll(options);
  }

  // Find one order by ID
  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  // Update order by ID
  async update(id: string, updateOrderDto: Partial<Order>): Promise<Order> {
    const updatedOrder = await this.orderRepo.update(id, updateOrderDto);
    if (!updatedOrder) throw new NotFoundException(`Order with ID ${id} not found`);
    return updatedOrder;
  }
}
