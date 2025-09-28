import { Menu } from '../../modules/database/entities/menu.entity';
import { MenuItem } from '../../modules/database/entities/menu-item.entity';
import { MenuResponseDto, MenuItemResponseDto } from '../../modules/menu/dto/menu-response.dto';

export class ResponseTransformer {
  static transformMenuItem(menuItem: MenuItem): MenuItemResponseDto {
    return {
      id: menuItem.id,
      name: menuItem.name,
      parent_id: menuItem.parent_id || null,
      menu_id: menuItem.menu_id,
      depth: menuItem.depth,
      created_at: menuItem.created_at.toISOString(),
      updated_at: menuItem.updated_at.toISOString(),
      // Children are constructed in hierarchy builders; default to empty array
      children: [],
    };
  }

  static transformMenu(menu: Menu): MenuResponseDto {
    // If items are available, build hierarchy from the flat list
    if (menu.items && menu.items.length > 0) {
      return this.transformMenuWithHierarchy(menu, menu.items);
    }
    // Otherwise, return an empty items array
    return {
      id: menu.id,
      name: menu.name,
      description: menu.description || undefined,
      created_at: menu.created_at.toISOString(),
      updated_at: menu.updated_at.toISOString(),
      items: [],
    };
  }

  static transformMenuWithHierarchy(menu: Menu, menuItems: MenuItem[]): MenuResponseDto {
    // Build the hierarchy from flat menu items
    const itemMap = new Map<string, MenuItemResponseDto>();
    const rootItems: MenuItemResponseDto[] = [];

    // First pass: create all items
    menuItems.forEach(item => {
      itemMap.set(item.id, this.transformMenuItem(item));
    });

    // Second pass: build hierarchy
    menuItems.forEach(item => {
      const transformedItem = itemMap.get(item.id)!;
      
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(transformedItem);
        }
      } else {
        rootItems.push(transformedItem);
      }
    });

    return {
      id: menu.id,
      name: menu.name,
      description: menu.description || undefined,
      created_at: menu.created_at.toISOString(),
      updated_at: menu.updated_at.toISOString(),
      items: rootItems,
    };
  }
}
