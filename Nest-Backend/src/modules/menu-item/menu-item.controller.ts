import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MoveMenuItemDto } from './dto/move-menu-item.dto';
import { MenuItem } from '../database/entities/menu-item.entity';

@ApiTags('menu-items')
@Controller('api/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Item created', type: MenuItem })
  async create(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemService.create(dto);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move a menu item under a new parent (and/or menu)' })
  @ApiParam({ name: 'id', description: 'Menu item ID' })
  @ApiResponse({ status: 200, description: 'Item moved', type: MenuItem })
  async move(@Param('id') id: string, @Body() dto: MoveMenuItemDto): Promise<MenuItem> {
    return this.menuItemService.move(id, dto);
  }
}