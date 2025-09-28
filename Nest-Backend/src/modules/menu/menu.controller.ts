import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { MenuResponseDto } from './dto/menu-response.dto';
import { ResponseTransformer } from '../../common/transformers/response.transformer';

// Pure functional handlers
const handleFindAllMenus = (service: MenuService) => () => service.findAll();
const handleFindOneMenu = (service: MenuService) => (id: string) => service.findOne(id);
const handleFindOneMenuWithItems = (service: MenuService) => (id: string) => service.findOneWithItems(id);

@ApiTags('menus')
@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, description: 'List of all menus', type: [MenuResponseDto] })
  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await handleFindAllMenus(this.menuService)();
    return menus.map(menu => ResponseTransformer.transformMenu(menu));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu by ID' })
  @ApiParam({ name: 'id', description: 'Menu ID' })
  @ApiResponse({ status: 200, description: 'Menu found', type: MenuResponseDto })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async findOne(@Param('id') id: string): Promise<MenuResponseDto> {
    const menu = await handleFindOneMenuWithItems(this.menuService)(id);
    return ResponseTransformer.transformMenu(menu);
  }
}
