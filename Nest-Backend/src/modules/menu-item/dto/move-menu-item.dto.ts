import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveMenuItemDto {
  @ApiProperty({
    description: 'UUID of the new parent menu item (optional)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  newParentId?: string;

  @ApiProperty({
    description: 'UUID of the new menu (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  newMenuId?: string;
}
