import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Menu } from './modules/database/entities/menu.entity';
import { MenuItem } from './modules/database/entities/menu-item.entity';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

// Database configuration for migration
const createDataSource = async (): Promise<DataSource> => {
  const configService = new ConfigService();
  
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  if (databaseUrl) {
    // Use DATABASE_URL for Neon database connection
    return new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [Menu, MenuItem],
      synchronize: false, // Don't auto-sync for migrations
      logging: true,
      ssl: { rejectUnauthorized: false },
    });
  }
  
  // Fallback to individual connection parameters for local development
  return new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'neondb'),
    entities: [Menu, MenuItem],
    synchronize: false,
    logging: true,
    ssl: false,
  });
};

// Run migration
const runMigration = async (): Promise<void> => {
  console.log('🔄 Starting database migration...');
  
  const dataSource = await createDataSource();
  
  try {
    await dataSource.initialize();
    console.log('📊 Database connection established');
    
    // Read and execute migration SQL files in order
    const migrations = [
      // Run only the parentId alias migration to avoid reapplying existing constraints
      '002-add-parentId-alias.sql',
    ];
    
    for (const file of migrations) {
      const migrationPath = path.join(__dirname, 'migrations', file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      console.log(`📝 Executing migration: ${file}`);
      await dataSource.query(migrationSQL);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('🔍 Verifying migration results...');
    const result = await dataSource.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'menu_items' 
      AND column_name = 'parent_id'
    `);
    
    if (result.length > 0) {
      console.log('📋 parent_id column details:');
      console.log(`   - Column: ${result[0].column_name}`);
      console.log(`   - Nullable: ${result[0].is_nullable}`);
      console.log(`   - Type: ${result[0].data_type}`);
    }
    
    // Check for indexes on parent_id and parentId
    const indexResultParentIdUnderscore = await dataSource.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'menu_items' 
      AND indexname = 'idx_menu_items_parent_id'
    `);
    if (indexResultParentIdUnderscore.length > 0) {
      console.log('✅ Index on parent_id created successfully');
    }
    const indexResultParentIdCamel = await dataSource.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'menu_items' 
      AND indexname = 'idx_menu_items_parentId'
    `);
    if (indexResultParentIdCamel.length > 0) {
      console.log('✅ Index on parentId created successfully');
    }
    
    // Check for foreign key constraints on both columns
    const fkResultUnderscore = await dataSource.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'menu_items' 
      AND constraint_name = 'FK_menu_items_parent_id'
    `);
    if (fkResultUnderscore.length > 0) {
      console.log('✅ Foreign key constraint on parent_id created successfully');
    }
    const fkResultCamel = await dataSource.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'menu_items' 
      AND constraint_name = 'FK_menu_items_parentId'
    `);
    if (fkResultCamel.length > 0) {
      console.log('✅ Foreign key constraint on parentId created successfully');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
};

// Run the migration
runMigration()
  .then(() => {
    console.log('🎉 Migration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  });
