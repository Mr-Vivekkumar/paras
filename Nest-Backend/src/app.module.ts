import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { MenuModule } from './modules/menu/menu.module';
// MenuItemModule removed to keep API read-only and minimal

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MenuModule,
  ],
})
export class AppModule {}
