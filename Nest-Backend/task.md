# NestJS Backend Development Task

## Project Overview
Create a NestJS backend application to support the existing Next.js Menu Management System frontend. The backend should provide RESTful API endpoints for managing hierarchical menu structures.

## Frontend Analysis Summary
The frontend is a Menu Management System with the following characteristics:
- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit
- **UI**: Radix UI + Tailwind CSS
- **Backend API**: Currently configured to connect to `http://localhost:3001`
- **Data Flow**: Hierarchical menu structure with nested items

## Data Structure Requirements

### Core Entities

#### Menu Entity
```typescript
interface Menu {
  id: string;           // UUID primary key
  name: string;         // Menu name
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
  items?: MenuItem[];   // Associated menu items
}
```

#### MenuItem Entity
```typescript
interface MenuItem {
  id: string;           // UUID primary key
  name: string;         // Item name
  menu_id: string;      // Foreign key to Menu
  parent_id?: string;   // Foreign key to parent MenuItem (nullable for root items)
  depth: number;        // Hierarchical depth level
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
  children?: MenuItem[]; // Nested children items
}
```

## API Endpoints Requirements

Based on frontend analysis, implement the following RESTful endpoints:

### 1. Menu Endpoints
- `GET /api/menus` - Retrieve all menus
- `GET /api/menus/:id` - Retrieve specific menu with hierarchical items
- `POST /api/menus` - Create new menu (optional for future expansion)

### 2. Menu Item Endpoints
- `POST /api/menu-items` - Create new menu item
  - **Request Body**: `{ menu_id: string, parent_id?: string, name: string }`
- `PUT /api/menu-items/:id` - Update menu item
  - **Request Body**: `{ name: string }`
- `DELETE /api/menu-items/:id` - Delete menu item and all children

## Technical Requirements

### 1. Framework & Dependencies
- **NestJS**: Latest version (v10.x)
- **TypeORM**: For database operations and tree structure management
- **PostgreSQL**: Primary database
- **Class Validator**: For request validation
- **Class Transformer**: For data transformation

### 2. Database Design
- Use TypeORM's `@Tree` decorator with `materialized-path` strategy
- Implement proper foreign key relationships
- Support hierarchical queries and operations
- Auto-calculate depth levels for menu items

### 3. Project Structure (Functional Approach)
```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── modules/
│   │   ├── menu/
│   │   │   ├── menu.module.ts
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.service.ts
│   │   │   └── dto/
│   │   │       ├── create-menu.dto.ts
│   │   │       └── update-menu.dto.ts
│   │   ├── menu-item/
│   │   │   ├── menu-item.module.ts
│   │   │   ├── menu-item.controller.ts
│   │   │   ├── menu-item.service.ts
│   │   │   └── dto/
│   │   │       ├── create-menu-item.dto.ts
│   │   │       └── update-menu-item.dto.ts
│   │   └── database/
│   │       ├── database.module.ts
│   │       └── entities/
│   │           ├── menu.entity.ts
│   │           └── menu-item.entity.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── interceptors/
│   └── config/
│       └── database.config.ts
├── package.json
├── nest-cli.json
└── .env
```

### 4. Core Dependencies
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
```

## Implementation Requirements

### 1. Database Entities
- Implement `Menu` entity with proper relationships
- Implement `MenuItem` entity with TypeORM tree structure
- Configure materialized-path tree strategy for efficient hierarchical operations
- Set up proper indexes for performance

### 2. DTOs and Validation
- Create comprehensive DTOs for all endpoints
- Implement class-validator decorators for request validation
- Handle validation errors with proper error messages

### 3. Services (Business Logic)
- Implement `MenuService` with CRUD operations
- Implement `MenuItemService` with tree operations
- Handle hierarchical data manipulation
- Implement proper error handling and logging

### 4. Controllers (API Layer)
- Implement RESTful controllers matching frontend expectations
- Handle HTTP status codes appropriately
- Implement proper error responses
- Add request/response logging

### 5. Database Configuration
- Configure PostgreSQL connection
- Set up TypeORM with proper entity registration
- Configure database synchronization for development
- Implement proper connection pooling

### 6. Error Handling
- Implement global exception filters
- Create custom error classes for business logic errors
- Provide meaningful error messages
- Log errors appropriately

### 7. CORS Configuration
- Enable CORS for frontend communication
- Configure allowed origins, methods, and headers
- Handle preflight requests

## Environment Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=menu_management

# Application Configuration
NODE_ENV=development
PORT=3001

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Performance Requirements

### 1. Database Optimization
- Implement proper indexing for tree queries
- Use materialized-path strategy for efficient tree operations
- Optimize queries for large hierarchical datasets
- Implement connection pooling

### 2. API Performance
- Implement response caching where appropriate
- Optimize database queries
- Use proper pagination for large datasets
- Implement request rate limiting

## Testing Requirements

### 1. Unit Tests
- Test all service methods
- Test controller endpoints
- Test DTO validation
- Achieve minimum 80% code coverage

### 2. Integration Tests
- Test database operations
- Test API endpoints end-to-end
- Test error scenarios
- Test hierarchical operations

### 3. Test Data
- Create comprehensive test fixtures
- Implement database seeding for tests
- Test with various tree structures

## Security Requirements

### 1. Input Validation
- Validate all incoming requests
- Sanitize user inputs
- Prevent SQL injection
- Implement request size limits

### 2. Error Handling
- Don't expose sensitive information in errors
- Implement proper logging without data leakage
- Handle database connection errors gracefully



## Development Workflow

### 1. Setup Instructions
1. Initialize NestJS project
2. Install required dependencies
3. Configure database connection
4. Set up environment variables
5. Run database migrations
6. Start development server

### 2. Development Scripts
```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

## Success Criteria

### 1. Functional Requirements
- ✅ All API endpoints working as expected by frontend
- ✅ Hierarchical menu structure properly maintained
- ✅ CRUD operations working for both menus and menu items
- ✅ Tree operations (create, update, delete) working correctly

### 2. Technical Requirements
- ✅ Proper error handling and validation
- ✅ Clean, maintainable code structure
- ✅ Comprehensive test coverage
- ✅ Performance optimized for expected load

### 3. Integration Requirements
- ✅ Frontend can successfully connect to backend
- ✅ All frontend operations work with backend
- ✅ Proper CORS configuration
- ✅ Environment configuration working

## Deliverables

1. **Complete NestJS Backend Application**
   - All source code
   - Configuration files
   - Database entities and migrations

2. **Documentation**
   - API documentation
   - Setup instructions
   - Deployment guide

3. **Testing**
   - Unit tests
   - Integration tests
   - Test coverage report

4. **Deployment**
   - Docker configuration
   - Environment setup
   - Production configuration

## Timeline Estimation

- **Setup & Configuration**: 1-2 days
- **Entity & Database Setup**: 2-3 days
- **Core Services Implementation**: 3-4 days
- **Controllers & API Endpoints**: 2-3 days
- **Testing & Validation**: 2-3 days
- **Documentation & Deployment**: 1-2 days

**Total Estimated Time**: 11-17 days

## Notes

- Ensure backend runs on port 3001 as expected by frontend
- Maintain consistency with frontend's data structure expectations
- Implement proper TypeScript types throughout
- Follow NestJS best practices and conventions
- Consider future scalability and feature additions
