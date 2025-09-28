# Menu Management System

A full-stack hierarchical menu management system built with Next.js 14, TypeScript, and Neon Database.

## Project Structure

This project has been separated into two main directories:

### Frontend (`/Frontend`)
- Next.js 14 frontend application
- React components with TypeScript
- Redux state management
- Tailwind CSS styling
- Runs on port 3000

### Backend (`/Backend`)
- Next.js 14 API routes
- Neon Database integration
- RESTful API endpoints
- Runs on port 3001

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Neon Database account

### 1. Backend Setup

```bash
cd Backend
npm install
```

Create `.env.local` file:
```
DATABASE_URL=your_neon_database_url
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Features

- **Hierarchical Menu Management**: Create and manage nested menu structures
- **Real-time Updates**: Changes reflect immediately across the interface
- **Mobile Responsive**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **CRUD Operations**: Full create, read, update, delete functionality
- **TypeScript**: Full type safety throughout the application

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Radix UI
- Lucide React

### Backend
- Next.js 14 API Routes
- TypeScript
- Neon Database (PostgreSQL)
- Neon Serverless

## Development

Both frontend and backend can be developed independently:

- Frontend communicates with backend via HTTP API calls
- Backend provides RESTful endpoints for all operations
- Database operations are handled server-side
- CORS is configured for cross-origin requests

## Database Schema

The system uses two main tables:

- `menus`: Stores menu definitions
- `menu_items`: Stores hierarchical menu items with parent-child relationships

See `Backend/scripts/` for database setup scripts.

## API Documentation

### Menus
- `GET /api/menus` - List all menus
- `POST /api/menus` - Create new menu
- `GET /api/menus/[id]` - Get menu with items
- `PUT /api/menus/[id]` - Update menu
- `DELETE /api/menus/[id]` - Delete menu

### Menu Items
- `GET /api/menu-items` - List all menu items
- `POST /api/menu-items` - Create new menu item
- `GET /api/menu-items/[id]` - Get menu item
- `PUT /api/menu-items/[id]` - Update menu item
- `DELETE /api/menu-items/[id]` - Delete menu item

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is private and proprietary.
