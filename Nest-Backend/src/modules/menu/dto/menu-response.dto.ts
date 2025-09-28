import { ApiProperty } from '@nestjs/swagger';

export class MenuItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the menu item',
    example: 'item-001',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Dashboard',
  })
  name: string;

  @ApiProperty({
    description: 'ID of the parent menu item (null for root items)',
    example: null,
    nullable: true,
  })
  parent_id: string | null;

  @ApiProperty({
    description: 'ID of the menu this item belongs to',
    example: 'menu-001',
  })
  menu_id: string;

  @ApiProperty({
    description: 'Depth level in the hierarchy (0, 1, 2, 3)',
    example: 0,
  })
  depth: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Array of child menu items',
    type: [MenuItemResponseDto],
    example: [],
  })
  children: MenuItemResponseDto[];
}

export class MenuResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the menu',
    example: 'menu-001',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the menu',
    example: 'Main Navigation',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the menu',
    example: 'Primary navigation menu for the application',
  })
  description?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-20T14:45:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Array of menu items in hierarchical structure',
    type: [MenuItemResponseDto],
  })
  items: MenuItemResponseDto[];
}
