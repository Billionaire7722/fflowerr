import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { Prisma } from '@prisma/client';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Post()
  create(@Body() data: Prisma.MaterialCreateInput) {
    return this.materialsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.MaterialUpdateInput) {
    return this.materialsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
