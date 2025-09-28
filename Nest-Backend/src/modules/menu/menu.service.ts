import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../database/entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

// Pure functional utilities
const createMenuEntity = (dto: CreateMenuDto): Partial<Menu> => ({
  name: dto.name,
  description: dto.description,
});

const updateMenuEntity = (menu: Menu, dto: UpdateMenuDto): Menu => ({
  ...menu,
  name: dto.name,
  description: dto.description,
  updated_at: new Date(),
});

const findMenuById = async (repository: Repository<Menu>, id: string): Promise<Menu> => {
  const menu = await repository.findOne({
    where: { id },
    relations: ['items'],
  });
  
  if (!menu) {
    throw new NotFoundException(`Menu with ID ${id} not found`);
  }
  
  return menu;
};

const findAllMenus = async (repository: Repository<Menu>): Promise<Menu[]> => {
  return repository.find({
    relations: ['items'],
    order: { created_at: 'ASC' },
  });
};

const searchMenus = async (repository: Repository<Menu>, searchTerm: string): Promise<Menu[]> => {
  return repository
    .createQueryBuilder('menu')
    .leftJoinAndSelect('menu.items', 'items')
    .where('menu.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
    .orderBy('menu.created_at', 'ASC')
    .getMany();
};

const getMenuWithItems = async (repository: Repository<Menu>, id: string): Promise<Menu> => {
  const menu = await repository.findOne({
    where: { id },
    relations: ['items'],
  });
  
  if (!menu) {
    throw new NotFoundException(`Menu with ID ${id} not found`);
  }
  
  return menu;
};

const getMenuStats = async (repository: Repository<Menu>, menuItemRepository: any): Promise<any> => {
  const menus = await repository.find({
    relations: ['items'],
  });
  
  return menus.map(menu => ({
    id: menu.id,
    name: menu.name,
    totalItems: menu.items?.length || 0,
    createdAt: menu.created_at,
    updatedAt: menu.updated_at,
  }));
};

const saveMenu = async (repository: Repository<Menu>, menuData: Partial<Menu>): Promise<Menu> => {
  const menu = repository.create(menuData);
  return repository.save(menu);
};

const removeMenu = async (repository: Repository<Menu>, id: string): Promise<void> => {
  const result = await repository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Menu with ID ${id} not found`);
  }
};

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // CREATE - Create a new menu
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menuData = createMenuEntity(createMenuDto);
    return saveMenu(this.menuRepository, menuData);
  }

  // READ - Get all menus
  async findAll(): Promise<Menu[]> {
    return findAllMenus(this.menuRepository);
  }

  // READ - Get a single menu by ID
  async findOne(id: string): Promise<Menu> {
    return findMenuById(this.menuRepository, id);
  }

  // READ - Get menu with all items
  async findOneWithItems(id: string): Promise<Menu> {
    return getMenuWithItems(this.menuRepository, id);
  }

  // READ - Search menus by name
  async search(searchTerm: string): Promise<Menu[]> {
    return searchMenus(this.menuRepository, searchTerm);
  }

  // READ - Get menu statistics
  async getStats(): Promise<any[]> {
    return getMenuStats(this.menuRepository, null);
  }

  // UPDATE - Update a menu
  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await findMenuById(this.menuRepository, id);
    const updatedMenu = updateMenuEntity(menu, updateMenuDto);
    return saveMenu(this.menuRepository, updatedMenu);
  }

  // DELETE - Remove a menu
  async remove(id: string): Promise<void> {
    return removeMenu(this.menuRepository, id);
  }

  async removeAllWithItems(): Promise<void> {
    await this.menuRepository.manager.getRepository('menu_item').clear();
    await this.menuRepository.clear();
  }
}
