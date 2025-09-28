import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    description: 'The name of the menu',
    example: 'Main Navigation',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the menu',
    example: 'Primary navigation menu for the application',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
