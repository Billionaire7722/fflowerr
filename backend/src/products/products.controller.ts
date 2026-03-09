import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 7 },
      { name: 'videos', maxCount: 3 },
    ]),
  )
  create(
    @Body() data: any,
    @UploadedFiles() files: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
  ) {
    // Convert tags string to array if it comes as a string (from FormData)
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch {
        data.tags = data.tags.split(',').map(t => t.trim());
      }
    }
    return this.productsService.create(data, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 7 },
      { name: 'videos', maxCount: 3 },
    ]),
  )
  update(
    @Param('id') id: string, 
    @Body() data: any,
    @UploadedFiles() files: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
  ) {
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch {
        data.tags = data.tags.split(',').map(t => t.trim());
      }
    }
    return this.productsService.update(id, data, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
