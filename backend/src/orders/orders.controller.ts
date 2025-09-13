import { Get, Query } from '@nestjs/common';
import { Controller, Post, Body, Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { ResponseUtil } from 'src/common/response/response.util';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Order } from './entity/order.schema';
import { OrderGateway } from './orders.gateway';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly ordersService: OrdersService,
    private readonly orderGateway : OrderGateway
  ) { }


  // Get all orders
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query() query?: any, // catch all other filters
  ) {
    const { page: _p, limit: _l, sortBy: _sb, sortOrder: _so, ...filters } = query;

    const orders = await this.ordersService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {},
      filters,
    });

    return ResponseUtil.success('Orders retrieved successfully', orders);
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','user')
  @Post()
  async createOrder(@Body() payload : CreateOrderDto) {
    await this.kafkaService.sendMessage('orders.in', payload);
    return ResponseUtil.success(null, 'Order is processing')
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  // Update a product by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Order>,
  ) {
    const updatedProduct = await this.ordersService.update(id, updateProductDto);

    // 🔥 Emit socket event
    this.orderGateway.sendOrderUpdate('Order delivered successfully', updatedProduct);

    return ResponseUtil.success('order updated successfully', { updatedProduct });
  }
}  
