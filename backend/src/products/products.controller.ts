import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { ResponseUtil } from 'src/common/response/response.util';
import { Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from 'src/upload/upload.service';



@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService : UploadService
  ) {}

  // Create a new product
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    // Optional: check for duplicate product by name
    const existingProduct = await this.productsService.findOneWithSelect(
      { name: createProductDto.name },
      ['name'],
    );

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    await this.uploadService.moveFileToUploads(createProductDto.image);

    const product = await this.productsService.create(createProductDto);

    return ResponseUtil.success('Product created successfully', { product });
  }
  
  // Get all products
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query() query?: any, // catch all other filters
  ) {
    const { page: _p, limit: _l, sortBy: _sb, sortOrder: _so, ...filters } = query;

    const products = await this.productsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {},
      filters,
    });

    return ResponseUtil.success('Products retrieved successfully', products);
  }
  
  // Get a single product by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    return ResponseUtil.success('Product retrieved successfully', { product });
  }
  

    // Create a new product
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  // Update a product by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    const updatedProduct = await this.productsService.update(id, updateProductDto);

    return ResponseUtil.success('Product updated successfully', { updatedProduct });
  }
  
    // Create a new product
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  // Delete a product by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.productsService.delete(id);
    return ResponseUtil.success(result.message);
  }
}
