# Menu Management Frontend

This is the frontend application for the Menu Management System, built with Next.js 14, React, and TypeScript.

## Features

- Hierarchical menu management interface
- Real-time menu tree visualization
- Mobile-responsive design
- Dark/light theme support
- Redux state management
- Modern UI components with Radix UI

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

The frontend is configured to communicate with the backend API running on `http://localhost:3001`. Make sure the backend server is running before starting the frontend.

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
Frontend/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── styles/             # Global styles
└── public/             # Static assets
```
