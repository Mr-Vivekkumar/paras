# 🚀 Menu Management API - Complete CRUD Operations

## 📋 Overview
This document provides a comprehensive guide to all available CRUD operations for the Menu Management System.

## 🔗 Base URL
```
http://localhost:3001/api
```

## 📊 Menu Operations

### 🆕 CREATE
- **POST** `/menus` - Create a new menu

### 📖 READ
- **GET** `/menus` - Get all menus
- **GET** `/menus/:id` - Get a menu by ID
- **GET** `/menus/:id/with-items` - Get a menu with all its items
- **GET** `/menus/search?q=term` - Search menus by name
- **GET** `/menus/stats/overview` - Get menu statistics overview

### ✏️ UPDATE
- **PATCH** `/menus/:id` - Update a menu (partial update)
- **PUT** `/menus/:id` - Update a menu (full update)

### 🗑️ DELETE
- **DELETE** `/menus/:id` - Delete a menu

## 🎯 Menu Item Operations

### 🆕 CREATE
- **POST** `/menu-items` - Create a new menu item

### 📖 READ
- **GET** `/menu-items` - Get all menu items
- **GET** `/menu-items?menuId=uuid` - Get menu items filtered by menu ID
- **GET** `/menu-items/:id` - Get a single menu item by ID
- **GET** `/menu-items/menu/:menuId/tree` - Get hierarchical menu items tree
- **GET** `/menu-items/:id/children` - Get children of a specific menu item
- **GET** `/menu-items/menu/:menuId/depth/:depth` - Get menu items by depth level
- **GET** `/menu-items/search?q=term` - Search menu items by name
- **GET** `/menu-items/search?q=term&menuId=uuid` - Search menu items with menu filter

### ✏️ UPDATE
- **PATCH** `/menu-items/:id` - Update a menu item (partial update)
- **PUT** `/menu-items/:id` - Update a menu item (full update)
- **PATCH** `/menu-items/:id/move` - Move a menu item to different parent or menu

### 🗑️ DELETE
- **DELETE** `/menu-items/:id` - Delete a menu item (only the item itself)
- **DELETE** `/menu-items/:id/with-children` - Delete a menu item and all its children

## 📝 Request/Response Examples

### Create Menu Item
```json
POST /api/menu-items
{
  "name": "New Menu Item",
  "menu_id": "56320ee9-6af6-11ed-a7ba-f220afe5e4a9",
  "parent_id": "optional-parent-uuid"
}
```

### Move Menu Item
```
PATCH /api/menu-items/uuid/move?newParentId=parent-uuid&newMenuId=menu-uuid
```

### Search Menu Items
```
GET /api/menu-items/search?q=System&menuId=56320ee9-6af6-11ed-a7ba-f220afe5e4a9
```

## 🌳 Hierarchical Structure Support

The API supports a 3-level hierarchical structure:
- **Depth 1**: Main categories (Systems, Users & Groups, Configuration Management, etc.)
- **Depth 2**: Subcategories (System Code, Users, System Settings, etc.)
- **Depth 3**: Specific items (Code Registration, User Account Registration, etc.)

## 🔍 Advanced Features

### Tree Navigation
- Get complete tree structure: `GET /menu-items/menu/:menuId/tree`
- Get children of specific item: `GET /menu-items/:id/children`
- Get items by depth: `GET /menu-items/menu/:menuId/depth/2`

### Search & Filter
- Search by name with ILIKE (case-insensitive)
- Filter by menu ID
- Combine search and filter operations

### Movement Operations
- Move items between parents
- Move items between menus
- Validation ensures parent-child relationships are maintained

## 📚 Swagger Documentation

Access the interactive API documentation at:
```
http://localhost:3001/api/docs
```

## 🎯 Key Features

✅ **Complete CRUD Operations** - Create, Read, Update, Delete for both menus and menu items
✅ **Hierarchical Management** - Full tree structure support with 3-level depth
✅ **Advanced Search** - Search by name with menu filtering
✅ **Movement Operations** - Move items between parents and menus
✅ **Bulk Operations** - Delete with children, get by depth
✅ **Swagger Integration** - Interactive API documentation
✅ **Korean Language Support** - Unicode support for international text
✅ **Validation** - Comprehensive input validation and error handling

## 🔧 Error Handling

The API returns appropriate HTTP status codes:
- **200**: Success
- **201**: Created
- **204**: No Content (for deletions)
- **400**: Bad Request
- **404**: Not Found
- **500**: Internal Server Error

All errors include descriptive messages to help with debugging and integration.
