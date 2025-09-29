import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ description: 'Name of the new menu item' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Menu ID where the item belongs', format: 'uuid' })
  @IsUUID()
  menu_id: string;

  @ApiProperty({ description: 'Parent item ID', format: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  parent_id?: string | null;
}