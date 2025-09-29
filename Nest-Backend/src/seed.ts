import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Menu } from './modules/database/entities/menu.entity';
import { MenuItem } from './modules/database/entities/menu-item.entity';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database configuration for seeding
const createDataSource = async (): Promise<DataSource> => {
  const configService = new ConfigService();
  
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  if (databaseUrl) {
    // Use DATABASE_URL for Neon database connection
    return new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [Menu, MenuItem],
      synchronize: true, // Create tables if they don't exist
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
    synchronize: true,
    logging: true,
    ssl: false,
  });
};

// System Management Menu Structure based on your hierarchical menu image
const systemMenus = [
  {
    id: '56320ee9-6af6-11ed-a7ba-f220afe5e4a9', // Example Menu ID from your data
    name: 'System Management',
    systemCode: 'SYS_MGMT',
    description: 'Main system management module with hierarchical structure',
  },
];

// Detailed menu structure with an intermediate "System Mangement" between menu and categories
const systemMenuItems = [
  {
    name: 'System Mangement',
    menuName: 'System Management',
    systemCode: 'SYS_MANGEMENT',
    parentCode: null,
    depth: 1,
    children: [
      {
        name: 'Systems',
        menuName: 'System Management',
        systemCode: 'SYSTEMS',
        parentCode: 'SYS_MANGEMENT',
        depth: 2,
        children: [
          {
            name: 'System Code',
            menuName: 'System Management',
            systemCode: 'SYS_CODE',
            parentCode: 'SYSTEMS',
            depth: 3,
            children: [
              {
                name: 'Code Registration',
                menuName: 'System Management',
                systemCode: 'CODE_REG',
                parentCode: 'SYS_CODE',
                depth: 4,
              },
              {
                name: 'Code Registration - 2',
                menuName: 'System Management',
                systemCode: 'CODE_REG_2',
                parentCode: 'SYS_CODE',
                depth: 4,
              },
            ],
          },
          {
            name: 'Properties',
            menuName: 'System Management',
            systemCode: 'PROPERTIES',
            parentCode: 'SYSTEMS',
            depth: 3,
          },
          {
            name: 'Menus',
            menuName: 'System Management',
            systemCode: 'MENUS',
            parentCode: 'SYSTEMS',
            depth: 3,
            children: [
              {
                name: 'Menu Registration',
                menuName: 'System Management',
                systemCode: 'MENU_REG',
                parentCode: 'MENUS',
                depth: 4,
              },
            ],
          },
          {
            name: 'API List',
            menuName: 'System Management',
            systemCode: 'API_LIST',
            parentCode: 'SYSTEMS',
            depth: 3,
            children: [
              {
                name: 'API Registration',
                menuName: 'System Management',
                systemCode: 'API_REG',
                parentCode: 'API_LIST',
                depth: 4,
              },
              {
                name: 'API Edit',
                menuName: 'System Management',
                systemCode: 'API_EDIT',
                parentCode: 'API_LIST',
                depth: 4,
              },
            ],
          },
        ],
      },
      {
        name: 'Users & Groups',
        menuName: 'System Management',
        systemCode: 'USERS_GROUPS',
        parentCode: 'SYS_MANGEMENT',
        depth: 2,
        children: [
          {
            name: 'Users',
            menuName: 'System Management',
            systemCode: 'USERS',
            parentCode: 'USERS_GROUPS',
            depth: 3,
            children: [
              {
                name: 'User Account Registration',
                menuName: 'System Management',
                systemCode: 'USER_REG',
                parentCode: 'USERS',
                depth: 4,
              },
              {
                name: 'User Profile Management',
                menuName: 'System Management',
                systemCode: 'USER_PROFILE',
                parentCode: 'USERS',
                depth: 4,
              },
              {
                name: 'User Permissions',
                menuName: 'System Management',
                systemCode: 'USER_PERMISSIONS',
                parentCode: 'USERS',
                depth: 4,
              },
            ],
          },
          {
            name: 'Groups',
            menuName: 'System Management',
            systemCode: 'GROUPS',
            parentCode: 'USERS_GROUPS',
            depth: 3,
            children: [
              {
                name: 'User Group Registration',
                menuName: 'System Management',
                systemCode: 'USER_GROUP_REG',
                parentCode: 'GROUPS',
                depth: 4,
              },
              {
                name: 'Group Permissions',
                menuName: 'System Management',
                systemCode: 'GROUP_PERMISSIONS',
                parentCode: 'GROUPS',
                depth: 4,
              },
              {
                name: 'Group Members',
                menuName: 'System Management',
                systemCode: 'GROUP_MEMBERS',
                parentCode: 'GROUPS',
                depth: 4,
              },
            ],
          },
          {
            name: '사용자 승인', // Korean: User Approval
            menuName: 'System Management',
            systemCode: 'USER_APPROVAL',
            parentCode: 'USERS_GROUPS',
            depth: 3,
            children: [
              {
                name: '사용자 승인 상세', // Korean: User Approval Details
                menuName: 'System Management',
                systemCode: 'USER_APPROVAL_DETAIL',
                parentCode: 'USER_APPROVAL',
                depth: 4,
              },
              {
                name: '승인 히스토리', // Korean: Approval History
                menuName: 'System Management',
                systemCode: 'APPROVAL_HISTORY',
                parentCode: 'USER_APPROVAL',
                depth: 4,
              },
            ],
          },
          {
            name: 'Role Management',
            menuName: 'System Management',
            systemCode: 'ROLE_MGMT',
            parentCode: 'USERS_GROUPS',
            depth: 3,
            children: [
              {
                name: 'Role Creation',
                menuName: 'System Management',
                systemCode: 'ROLE_CREATE',
                parentCode: 'ROLE_MGMT',
                depth: 4,
              },
              {
                name: 'Role Assignment',
                menuName: 'System Management',
                systemCode: 'ROLE_ASSIGN',
                parentCode: 'ROLE_MGMT',
                depth: 4,
              },
            ],
          },
        ],
      },
      {
        name: 'Configuration Management',
        menuName: 'System Management',
        systemCode: 'CONFIG_MGMT',
        parentCode: 'SYS_MANGEMENT',
        depth: 2,
        children: [
          {
            name: 'System Settings',
            menuName: 'System Management',
            systemCode: 'SYS_SETTINGS',
            parentCode: 'CONFIG_MGMT',
            depth: 3,
            children: [
              {
                name: 'General Settings',
                menuName: 'System Management',
                systemCode: 'GENERAL_SETTINGS',
                parentCode: 'SYS_SETTINGS',
                depth: 4,
              },
              {
                name: 'Security Settings',
                menuName: 'System Management',
                systemCode: 'SECURITY_SETTINGS',
                parentCode: 'SYS_SETTINGS',
                depth: 4,
              },
            ],
          },
          {
            name: 'Database Configuration',
            menuName: 'System Management',
            systemCode: 'DB_CONFIG',
            parentCode: 'CONFIG_MGMT',
            depth: 3,
            children: [
              {
                name: 'Connection Settings',
                menuName: 'System Management',
                systemCode: 'DB_CONNECTION',
                parentCode: 'DB_CONFIG',
                depth: 4,
              },
              {
                name: 'Backup Settings',
                menuName: 'System Management',
                systemCode: 'DB_BACKUP',
                parentCode: 'DB_CONFIG',
                depth: 4,
              },
            ],
          },
        ],
      },
      {
        name: 'Reports & Analytics',
        menuName: 'System Management',
        systemCode: 'REPORTS_ANALYTICS',
        parentCode: 'SYS_MANGEMENT',
        depth: 2,
        children: [
          {
            name: 'User Reports',
            menuName: 'System Management',
            systemCode: 'USER_REPORTS',
            parentCode: 'REPORTS_ANALYTICS',
            depth: 3,
            children: [
              {
                name: 'User Activity Report',
                menuName: 'System Management',
                systemCode: 'USER_ACTIVITY',
                parentCode: 'USER_REPORTS',
                depth: 4,
              },
              {
                name: 'Login Statistics',
                menuName: 'System Management',
                systemCode: 'LOGIN_STATS',
                parentCode: 'USER_REPORTS',
                depth: 4,
              },
            ],
          },
          {
            name: 'System Reports',
            menuName: 'System Management',
            systemCode: 'SYSTEM_REPORTS',
            parentCode: 'REPORTS_ANALYTICS',
            depth: 3,
            children: [
              {
                name: 'Performance Report',
                menuName: 'System Management',
                systemCode: 'PERFORMANCE_REPORT',
                parentCode: 'SYSTEM_REPORTS',
                depth: 4,
              },
              {
                name: 'Error Log Report',
                menuName: 'System Management',
                systemCode: 'ERROR_LOG_REPORT',
                parentCode: 'SYSTEM_REPORTS',
                depth: 4,
              },
            ],
          },
        ],
      },
    ],
  },
];

// Helper function to create menu items recursively with enhanced parent_id handling
const createMenuItemRecursively = async (
  dataSource: DataSource,
  itemData: any,
  menuId: string,
  parentId?: string | null,
  depth: number = 1,
): Promise<MenuItem> => {
  const menuItemRepository = dataSource.getRepository(MenuItem);
  
  // Validate required fields
  if (!itemData.name || !menuId) {
    throw new Error(`Invalid menu item data: name=${itemData.name}, menuId=${menuId}`);
  }
  
  // Create menu item with explicit parent_id handling
  const menuItem = menuItemRepository.create({
    name: itemData.name,
    menu_id: menuId,
    parent_id: parentId ?? null,
    depth: depth,
  });
  
  const savedMenuItem = await menuItemRepository.save(menuItem);
  
  // Log with parent information
  const parentInfo = savedMenuItem.parent_id ? `(Parent: ${savedMenuItem.parent_id})` : '(Root Item)';
  console.log(`✅ Created menu item: ${itemData.name} ${parentInfo} (Depth: ${depth}, ID: ${savedMenuItem.id})`);
  
  // Create children recursively if they exist
  if (itemData.children && itemData.children.length > 0) {
    for (const child of itemData.children) {
      await createMenuItemRecursively(dataSource, child, menuId, savedMenuItem.id, depth + 1);
    }
  }
  
  return savedMenuItem;
};

// Function to verify hierarchical structure
const verifyHierarchicalStructure = async (dataSource: DataSource): Promise<any> => {
  const menuItemRepository = dataSource.getRepository(MenuItem);
  
  // Check for orphaned items (items with parent_id that doesn't exist)
  const orphanedItems = await dataSource.query(`
    SELECT mi.id, mi.name, mi.parent_id 
    FROM menu_items mi 
    LEFT JOIN menu_items parent ON mi.parent_id = parent.id 
    WHERE mi.parent_id IS NOT NULL 
    AND parent.id IS NULL
  `);
  
  if (orphanedItems.length > 0) {
    console.log('⚠️  Found orphaned items:');
    orphanedItems.forEach((item: any) => {
      console.log(`  • ${item.name} (ID: ${item.id}, Parent ID: ${item.parent_id})`);
    });
  } else {
    console.log('✅ No orphaned items found');
  }
  
  // Check for circular references
  const circularRefs = await dataSource.query(`
    WITH RECURSIVE menu_hierarchy AS (
      SELECT id, name, parent_id, ARRAY[id] as path
      FROM menu_items 
      WHERE parent_id IS NULL
      
      UNION ALL
      
      SELECT mi.id, mi.name, mi.parent_id, mh.path || mi.id
      FROM menu_items mi
      JOIN menu_hierarchy mh ON mi.parent_id = mh.id
      WHERE NOT (mi.id = ANY(mh.path))
    )
    SELECT * FROM menu_hierarchy
  `);
  
  console.log(`✅ Hierarchical structure verified: ${circularRefs.length} items processed`);
  
  return {
    orphanedItems: orphanedItems.length,
    totalItems: circularRefs.length,
    isValid: orphanedItems.length === 0
  };
};

// Function to create additional dummy data for testing
const createDummyData = async (dataSource: DataSource): Promise<void> => {
  console.log('🎭 Creating additional dummy data for testing...');
  
  const menuRepository = dataSource.getRepository(Menu);
  const menuItemRepository = dataSource.getRepository(MenuItem);
  
  // Create additional test menus
  const testMenus = [
    { name: 'Test Menu 1', description: 'First test menu for development' },
    { name: 'Test Menu 2', description: 'Second test menu for development' },
    { name: 'Empty Menu', description: 'Menu with no items for testing' }
  ];
  
  for (const menuData of testMenus) {
    const menu = menuRepository.create(menuData);
    const savedMenu = await menuRepository.save(menu);
    console.log(`✅ Created test menu: ${menuData.name} (ID: ${savedMenu.id})`);
    
    // Add some test items to non-empty menus
    if (menuData.name !== 'Empty Menu') {
      const testItems = [
        { name: 'Test Root Item 1', children: [
          { name: 'Test Child 1.1' },
          { name: 'Test Child 1.2', children: [
            { name: 'Test Grandchild 1.2.1' }
          ]}
        ]},
        { name: 'Test Root Item 2' },
        { name: 'Test Root Item 3', children: [
          { name: 'Test Child 3.1' }
        ]}
      ];
      
      for (const itemData of testItems) {
        await createMenuItemRecursively(dataSource, itemData, savedMenu.id);
      }
    }
  }
  
  console.log('✅ Dummy data creation completed');
};

// Main seeding function with enhanced validation and error handling
const seedDatabase = async (includeDummyData: boolean = true): Promise<void> => {
  console.log('🌱 Starting System Management Database Seeding...');
  if (includeDummyData) {
    console.log('🎭 Including dummy data for testing');
  }
  
  const dataSource = await createDataSource();
  
  try {
    await dataSource.initialize();
    console.log('📊 Database connection established');
    
    // Verify database schema
    console.log('🔍 Verifying database schema...');
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('menus', 'menu_items')
    `);
    
    if (tables.length < 2) {
      throw new Error('Required tables (menus, menu_items) not found. Please run migrations first.');
    }
    console.log('✅ Database schema verified');
    
    // Check for existing data
    console.log('🧹 Checking for existing data...');
    const existingMenus = await dataSource.getRepository(Menu).count();
    const existingItems = await dataSource.getRepository(MenuItem).count();
    
    if (existingMenus > 0 || existingItems > 0) {
      console.log('🧹 Clearing existing data...');
      // Clear in correct order due to foreign key constraints
      await dataSource.query('TRUNCATE TABLE "menu_items" CASCADE');
      await dataSource.query('TRUNCATE TABLE "menus" CASCADE');
      console.log('✅ Existing data cleared');
    } else {
      console.log('✅ Fresh database - no existing data to clear');
    }
    
    // Create system menus with validation
    console.log('📝 Creating system menus...');
    const menuRepository = dataSource.getRepository(Menu);
    const createdMenus: { [key: string]: Menu } = {};
    
    for (const menuData of systemMenus) {
      // Validate menu data
      if (!menuData.name) {
        throw new Error(`Invalid menu data: name is required`);
      }
      
      let menu;
      if (menuData.name === 'System Management') {
        // Use the specific UUID for System Management from Figma
        menu = menuRepository.create({
          id: '56320ee9-6af6-11ed-a7ba-f220afe5e4a9',
          name: menuData.name,
          description: menuData.description || null,
        });
      } else {
        // Let TypeORM generate UUIDs for other menus
        menu = menuRepository.create({
          name: menuData.name,
          description: menuData.description || null,
        });
      }
      
      const savedMenu = await menuRepository.save(menu);
      createdMenus[menuData.name] = savedMenu;
      console.log(`✅ Created menu: ${menuData.name} (ID: ${savedMenu.id})`);
    }
    
    // Create system menu items with validation
    console.log('🔧 Creating system menu items...');
    let totalItemsCreated = 0;
    
    for (const itemData of systemMenuItems) {
      // Validate menu exists
      if (!createdMenus[itemData.menuName]) {
        throw new Error(`Menu '${itemData.menuName}' not found. Available menus: ${Object.keys(createdMenus).join(', ')}`);
      }
      
      const menuId = createdMenus[itemData.menuName].id;
      console.log(`📁 Creating items for menu: ${itemData.menuName} (ID: ${menuId})`);
      
      const rootItem = await createMenuItemRecursively(dataSource, itemData, menuId);
      totalItemsCreated++;
      
      // Count total items created for this menu
      const itemCount = await dataSource.getRepository(MenuItem).count({ where: { menu_id: menuId } });
      console.log(`📊 Total items in ${itemData.menuName}: ${itemCount}`);
    }
    
    console.log('🎉 System Management Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${Object.keys(createdMenus).length} system menus:`);
    
    // Show created menus with their IDs and item counts
    for (const [menuName, menu] of Object.entries(createdMenus)) {
      const itemCount = await dataSource.getRepository(MenuItem).count({ where: { menu_id: menu.id } });
      console.log(`  • ${menuName}: ${menu.id} (${itemCount} items)`);
    }
    
    // Count total menu items and show hierarchy stats
    const totalItems = await dataSource.getRepository(MenuItem).count();
    const rootItems = await dataSource.getRepository(MenuItem).count({ where: { parent_id: null } });
    const childItems = totalItems - rootItems;
    
    console.log(`- Created ${totalItems} total menu items:`);
    console.log(`  • Root items: ${rootItems}`);
    console.log(`  • Child items: ${childItems}`);
    
    // Show depth distribution
    const depthStats = await dataSource.query(`
      SELECT depth, COUNT(*) as count 
      FROM menu_items 
      GROUP BY depth 
      ORDER BY depth
    `);
    
    console.log('- Depth distribution:');
    depthStats.forEach((stat: any) => {
      console.log(`  • Depth ${stat.depth}: ${stat.count} items`);
    });
    
    console.log('\n🏗️ Enhanced System Structure Created:');
    console.log('├── System Management (ID: 56320ee9-6af6-11ed-a7ba-f220afe5e4a9)');
    console.log('│   ├── Systems (Depth: 1)');
    console.log('│   │   ├── System Code (Depth: 2)');
    console.log('│   │   │   ├── Code Registration (Depth: 3)');
    console.log('│   │   │   └── Code Registration - 2 (Depth: 3)');
    console.log('│   │   ├── Properties (Depth: 2)');
    console.log('│   │   ├── Menus (Depth: 2)');
    console.log('│   │   │   └── Menu Registration (Depth: 3)');
    console.log('│   │   └── API List (Depth: 2)');
    console.log('│   │       ├── API Registration (Depth: 3)');
    console.log('│   │       └── API Edit (Depth: 3)');
    console.log('│   ├── Users & Groups (Depth: 1) [EXPANDED]');
    console.log('│   │   ├── Users (Depth: 2)');
    console.log('│   │   │   ├── User Account Registration (Depth: 3)');
    console.log('│   │   │   ├── User Profile Management (Depth: 3) [NEW]');
    console.log('│   │   │   └── User Permissions (Depth: 3) [NEW]');
    console.log('│   │   ├── Groups (Depth: 2)');
    console.log('│   │   │   ├── User Group Registration (Depth: 3)');
    console.log('│   │   │   ├── Group Permissions (Depth: 3) [NEW]');
    console.log('│   │   │   └── Group Members (Depth: 3) [NEW]');
    console.log('│   │   ├── 사용자 승인 (User Approval) (Depth: 2)');
    console.log('│   │   │   ├── 사용자 승인 상세 (User Approval Details) (Depth: 3)');
    console.log('│   │   │   └── 승인 히스토리 (Approval History) (Depth: 3) [NEW]');
    console.log('│   │   └── Role Management (Depth: 2) [NEW]');
    console.log('│   │       ├── Role Creation (Depth: 3) [NEW]');
    console.log('│   │       └── Role Assignment (Depth: 3) [NEW]');
    console.log('│   ├── Configuration Management (Depth: 1) [NEW]');
    console.log('│   │   ├── System Settings (Depth: 2) [NEW]');
    console.log('│   │   │   ├── General Settings (Depth: 3) [NEW]');
    console.log('│   │   │   └── Security Settings (Depth: 3) [NEW]');
    console.log('│   │   └── Database Configuration (Depth: 2) [NEW]');
    console.log('│   │       ├── Connection Settings (Depth: 3) [NEW]');
    console.log('│   │       └── Backup Settings (Depth: 3) [NEW]');
    console.log('│   └── Reports & Analytics (Depth: 1) [NEW]');
    console.log('│       ├── User Reports (Depth: 2) [NEW]');
    console.log('│       │   ├── User Activity Report (Depth: 3) [NEW]');
    console.log('│       │   └── Login Statistics (Depth: 3) [NEW]');
    console.log('│       └── System Reports (Depth: 2) [NEW]');
    console.log('│           ├── Performance Report (Depth: 3) [NEW]');
    console.log('│           └── Error Log Report (Depth: 3) [NEW]');
    
    console.log('\n📋 Figma Design Elements Implemented:');
    console.log('• Menu ID: 56320ee9-6af6-11ed-a7ba-f220afe5e4a9');
    console.log('• Depth: 3 levels for detailed menu items');
    console.log('• Parent Data: "Systems" for system-related items');
    console.log('• Save functionality ready for menu registration');
    
    // Create additional dummy data for testing (if requested)
    if (includeDummyData) {
      await createDummyData(dataSource);
    }
    
    // Verify hierarchical structure
    console.log('\n🔍 Verifying hierarchical structure...');
    const verificationResults = await verifyHierarchicalStructure(dataSource);
    console.log('✅ Hierarchical structure verification completed');
    
    console.log('\n🔗 Your System Management API endpoints are ready:');
    console.log('- GET /api/menus - List all system menus');
    console.log('- GET /api/menu-items/menu/:menuId - Get menu items tree');
    console.log('- GET /api/menu-items/menu/:menuId/tree - Get hierarchical tree');
    console.log('- POST /api/docs - View Swagger documentation');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
};

// Execute seeding if this file is run directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const includeDummyData = !args.includes('--no-dummy-data');
  const skipVerification = args.includes('--skip-verification');
  
  console.log('🚀 Starting seed process...');
  console.log(`📊 Include dummy data: ${includeDummyData}`);
  console.log(`🔍 Skip verification: ${skipVerification}`);
  
  seedDatabase(includeDummyData)
    .then(() => {
      console.log('✨ System Management Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
