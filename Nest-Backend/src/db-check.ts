import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Menu } from './modules/database/entities/menu.entity';
import { MenuItem } from './modules/database/entities/menu-item.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const createDataSource = async (): Promise<DataSource> => {
  const configService = new ConfigService();
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [Menu, MenuItem],
      synchronize: false,
      logging: true,
      ssl: { rejectUnauthorized: false },
    });
  }

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

const run = async () => {
  console.log('🔎 Checking database contents...');
  const ds = await createDataSource();
  try {
    await ds.initialize();
    console.log('📊 Connected to database');

    // Check presence of columns
    const columns = await ds.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'menu_items'
      ORDER BY column_name;
    `);
    const columnNames = columns.map((c: any) => c.column_name);
    console.log('🧱 menu_items columns:', columnNames);

    // Counts
    const menusCount = await ds.getRepository(Menu).count();
    const itemsCount = await ds.getRepository(MenuItem).count();
    console.log(`📦 menus: ${menusCount}, menu_items: ${itemsCount}`);

    // Sample menus
    const menus = await ds.getRepository(Menu).find({ take: 5, order: { created_at: 'ASC' } });
    console.log('🗂️ Sample menus (up to 5):');
    menus.forEach(m => console.log(`- ${m.id} | ${m.name}`));

    // Sample items
    const sampleItems = await ds.query(`
      SELECT id, name, menu_id, parent_id, depth
      FROM menu_items
      ORDER BY created_at ASC
      LIMIT 10;
    `);
    console.log('🌳 Sample menu_items (up to 10):');
    sampleItems.forEach((i: any) => {
      console.log(`- ${i.id} | name=${i.name} | menu_id=${i.menu_id} | parent_id=${i.parent_id} | depth=${i.depth}`);
    });

    // Check foreign keys
    const fks = await ds.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'menu_items'
        AND constraint_type = 'FOREIGN KEY';
    `);
    console.log('🔗 Foreign keys on menu_items:', fks.map((f: any) => f.constraint_name));

    // Check orphaned items
    const orphaned = await ds.query(`
      SELECT mi.id, mi.name, mi.parent_id
      FROM menu_items mi
      LEFT JOIN menu_items p ON mi.parent_id = p.id
      WHERE mi.parent_id IS NOT NULL AND p.id IS NULL
      LIMIT 10;
    `);
    console.log(`⚠️ Orphaned items: ${orphaned.length}`);
    orphaned.forEach((o: any) => console.log(`- ${o.id} | ${o.name} | parent_id=${o.parent_id}`));

    // Check a menu hierarchy counts
    const oneMenu = menus[0];
    if (oneMenu) {
      const countsByDepth = await ds.query(`
        SELECT depth, COUNT(*)
        FROM menu_items
        WHERE menu_id = $1
        GROUP BY depth
        ORDER BY depth;
      `, [oneMenu.id]);
      console.log('📐 Items by depth for first menu:', countsByDepth);
    }

    console.log('✅ DB check completed');
  } catch (err) {
    console.error('❌ DB check failed:', err);
    process.exitCode = 1;
  } finally {
    await ds.destroy();
    console.log('🔌 Connection closed');
  }
};

run();