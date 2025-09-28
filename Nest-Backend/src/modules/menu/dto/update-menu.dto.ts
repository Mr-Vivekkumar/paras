import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuDto {
  @ApiProperty({
    description: 'The name of the menu',
    example: 'Updated Menu Name',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the menu',
    example: 'Updated description for the menu',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
