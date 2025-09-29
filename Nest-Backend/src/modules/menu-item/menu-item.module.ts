import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}