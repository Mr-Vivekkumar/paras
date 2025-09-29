import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../database/entities/menu-item.entity';
import { Menu } from '../database/entities/menu.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MoveMenuItemDto } from './dto/move-menu-item.dto';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(dto: CreateMenuItemDto): Promise<MenuItem> {
    const menu = await this.menuRepository.findOne({ where: { id: dto.menu_id } });
    if (!menu) throw new NotFoundException('Menu not found');

    let depth = 0;
    if (dto.parent_id) {
      const parent = await this.menuItemRepository.findOne({ where: { id: dto.parent_id } });
      if (!parent) throw new NotFoundException('Parent item not found');
      depth = (parent.depth ?? 0) + 1;
    }

    const item = new MenuItem();
    item.name = dto.name;
    item.menu_id = dto.menu_id as any;
    item.parent_id = (dto.parent_id ?? null) as any;
    item.depth = depth as any;
    return this.menuItemRepository.save(item);
  }

  async move(id: string, dto: MoveMenuItemDto): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');

    const newMenu = await this.menuRepository.findOne({ where: { id: dto.newMenuId } });
    if (!newMenu) throw new NotFoundException('Target menu not found');

    let newDepth = 0;
    if (dto.newParentId) {
      const newParent = await this.menuItemRepository.findOne({ where: { id: dto.newParentId } });
      if (!newParent) throw new NotFoundException('New parent not found');
      newDepth = (newParent.depth ?? 0) + 1;
    }

    // Compute depth delta and update subtree depths
    const oldDepth = item.depth ?? 0;
    const depthDelta = newDepth - oldDepth;

    // Fetch all items to update subtree if needed
    const allItems = await this.menuItemRepository.find({ where: { menu_id: item.menu_id } });
    const children = allItems.filter((it) => it.parent_id === item.id);

    // Update the item itself
    item.parent_id = dto.newParentId ?? null;
    item.menu_id = dto.newMenuId;
    item.depth = newDepth;

    await this.menuItemRepository.save(item);

    // If menu changes, update subtree menu_id as well
    const queue: MenuItem[] = [...children];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      curr.depth = (curr.depth ?? 0) + depthDelta;
      curr.menu_id = item.menu_id;
      await this.menuItemRepository.save(curr);
      const currChildren = allItems.filter((it) => it.parent_id === curr.id);
      queue.push(...currChildren);
    }

    return item;
  }
}