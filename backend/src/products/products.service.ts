import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entity/product.schema';
import { ProductsRepository } from './entity/product.repository';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepo: ProductsRepository) {}

  // Create
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepo.create(createProductDto);
  }

  // Find all
  async findAll(options?: object) {
    return this.productRepo.findAll(options);
  }

  // Find all with selected fields
  async findAllWithSelect(selectFields: string[], filter: object = {}): Promise<Product[]> {
    return this.productRepo.findAllSelect(filter, selectFields);
  }

  // Find one by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  // Find one by filter with selected fields
  async findOneWithSelect(filter: object, selectFields: string[]): Promise<Product> {
    const product = await this.productRepo.findOneSelect(filter, selectFields);
    return product;
  }

  // Update by ID
  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const updatedProduct = await this.productRepo.update(id, updateProductDto);
    if (!updatedProduct) throw new NotFoundException(`Product with ID ${id} not found`);
    return updatedProduct;
  }

  // Delete by ID
  async delete(id: string): Promise<{ message: string }> {
    const deletedProduct = await this.productRepo.delete(id);
    if (!deletedProduct) throw new NotFoundException(`Product with ID ${id} not found`);
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
