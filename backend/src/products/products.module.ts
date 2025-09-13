import { Module } from '@nestjs/common';
import { Product, ProductSchema } from './entity/product.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './entity/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
      // Import the User schema so UsersRepository can inject the model
      MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
      UploadModule
    ],
  controllers: [ProductsController],
  providers: [ProductsService,ProductsRepository] 
})
export class ProductsModule {}
