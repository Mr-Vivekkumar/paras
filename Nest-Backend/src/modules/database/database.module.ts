import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabaseConfig } from '../../config/database.config';
import { Menu } from './entities/menu.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: createDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Menu, MenuItem]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
