import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Menu } from '../modules/database/entities/menu.entity';
import { MenuItem } from '../modules/database/entities/menu-item.entity';

export const createDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  if (databaseUrl) {
    // Use DATABASE_URL for Neon database connection
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [Menu, MenuItem],
      synchronize: configService.get<string>('NODE_ENV') === 'development',
      logging: configService.get<string>('NODE_ENV') === 'development',
      ssl: { rejectUnauthorized: false }, // Neon requires SSL
    };
  }
  
  // Fallback to individual connection parameters for local development
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'neondb'),
    entities: [Menu, MenuItem],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };
};
