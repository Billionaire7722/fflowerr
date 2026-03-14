import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.materialsService.create(data, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string, 
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.materialsService.update(id, data, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
