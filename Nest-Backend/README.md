# Menu Management Backend

A NestJS backend application for managing hierarchical menu structures, built using functional programming principles.

## Features

- **Functional Programming**: Pure functions, immutable data structures, and functional composition
- **Hierarchical Menu Structure**: Tree-based menu items with unlimited nesting
- **TypeORM Integration**: Materialized path strategy for efficient tree operations
- **PostgreSQL Database**: Robust relational database with tree support
- **RESTful API**: Clean, consistent API endpoints
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Global exception filters with proper error responses
- **CORS Support**: Configured for frontend communication
- **Logging**: Request/response logging with performance metrics

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator & class-transformer
- **Language**: TypeScript
- **Architecture**: Functional Programming

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Root module
├── config/
│   └── database.config.ts    # Database configuration
├── modules/
│   ├── database/
│   │   ├── database.module.ts
│   │   └── entities/
│   │       ├── menu.entity.ts
│   │       └── menu-item.entity.ts
│   ├── menu/
│   │   ├── menu.module.ts
│   │   ├── menu.controller.ts
│   │   ├── menu.service.ts
│   │   └── dto/
│   │       ├── create-menu.dto.ts
│   │       └── update-menu.dto.ts
│   └── menu-item/
│       ├── menu-item.module.ts
│       ├── menu-item.controller.ts
│       ├── menu-item.service.ts
│       └── dto/
│           ├── create-menu-item.dto.ts
│           └── update-menu-item.dto.ts
└── common/
    ├── filters/
    │   ├── all-exceptions.filter.ts
    │   └── http-exception.filter.ts
    └── interceptors/
        └── logging.interceptor.ts
```

## API Endpoints

### Menu Endpoints
- `GET /api/menus` - Retrieve all menus
- `GET /api/menus/:id` - Retrieve specific menu with hierarchical items
- `POST /api/menus` - Create new menu
- `PATCH /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu

### Menu Item Endpoints
- `POST /api/menu-items` - Create new menu item
- `PATCH /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item and all children
- `GET /api/menu-items/menu/:menuId` - Get hierarchical tree of menu items

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd menu-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=menu_management
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb menu_management
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## Development Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## Database Schema

### Menu Entity
```typescript
interface Menu {
  id: string;           // UUID primary key
  name: string;         // Menu name
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
  items?: MenuItem[];   // Associated menu items
}
```

### MenuItem Entity
```typescript
interface MenuItem {
  id: string;           // UUID primary key
  name: string;         // Item name
  menu_id: string;      // Foreign key to Menu
  parent_id?: string;   // Foreign key to parent MenuItem
  depth: number;        // Hierarchical depth level
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
  children?: MenuItem[]; // Nested children items
}
```

## Functional Programming Features

### Pure Functions
All business logic is implemented as pure functions that:
- Always return the same output for the same input
- Have no side effects
- Are easily testable and composable

### Immutable Data Structures
- Entity updates create new objects instead of mutating existing ones
- Functional composition for complex operations
- No shared mutable state

### Functional Composition
- Service methods are composed of smaller, reusable functions
- Controller handlers use functional composition
- Error handling and logging are implemented functionally

## Error Handling

The application includes comprehensive error handling:

- **Global Exception Filter**: Catches all unhandled exceptions
- **HTTP Exception Filter**: Handles HTTP-specific errors
- **Validation Errors**: Automatic validation with meaningful messages
- **Database Errors**: Proper handling of database connection and query errors
- **Logging**: All errors are logged with context information

## CORS Configuration

CORS is configured to allow:
- Frontend URL: `http://localhost:3000`
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Headers: Content-Type, Authorization
- Credentials: Enabled

## Performance Optimizations

- **Database Indexing**: Optimized indexes for tree queries
- **Materialized Path**: Efficient tree operations using TypeORM's materialized-path strategy
- **Connection Pooling**: Database connection pooling for better performance
- **Request Logging**: Performance monitoring with request duration tracking

## Testing

The application includes comprehensive testing:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test database operations and API endpoints
- **E2E Tests**: Test complete user workflows
- **Coverage**: Minimum 80% code coverage requirement

## Deployment

### Docker Support
```bash
# Build Docker image
docker build -t menu-management-backend .

# Run with Docker Compose
docker-compose up -d
```

### Production Configuration
- Set `NODE_ENV=production`
- Configure production database
- Set up proper logging
- Configure SSL/TLS
- Set up monitoring and health checks

## Contributing

1. Follow functional programming principles
2. Write comprehensive tests
3. Use TypeScript strict mode
4. Follow NestJS best practices
5. Document all public APIs

## License

This project is licensed under the MIT License.
