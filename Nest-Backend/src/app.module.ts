import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { MenuModule } from './modules/menu/menu.module';
import { MenuItemModule } from './modules/menu-item/menu-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MenuModule,
    MenuItemModule,
  ],
})
export class AppModule {}
