# Todo Application

## Overview

This is a full-stack todo application built with React frontend and Express backend. The application uses a PostgreSQL database with Drizzle ORM for data persistence. The frontend is built with React, TypeScript, and Tailwind CSS using the shadcn/ui component library. The backend is a REST API built with Express.js.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: tsx for TypeScript execution

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`

## Key Components

### Frontend Components
- **App.tsx**: Main application component with routing setup
- **Home Page**: Main todo interface with CRUD operations
- **UI Components**: Comprehensive shadcn/ui component library
- **Form Handling**: React Hook Form integration with Zod validation
- **Toast Notifications**: User feedback system

### Backend Components
- **Routes**: RESTful API endpoints for todo operations
- **Storage**: Abstract storage interface with in-memory implementation
- **Schema**: Shared type definitions and validation schemas
- **Middleware**: Request logging and error handling

### Shared Components
- **Schema**: Centralized data models and validation using Drizzle and Zod
- **Type Safety**: Shared TypeScript types between frontend and backend

## Data Flow

### Todo Operations
1. **Create Todo**: Frontend form → Zod validation → API POST `/api/todos` → Database insert
2. **Read Todos**: Frontend query → API GET `/api/todos` → Database select → React Query cache
3. **Update Todo**: Frontend form → Zod validation → API PUT `/api/todos/:id` → Database update
4. **Delete Todo**: Frontend action → API DELETE `/api/todos/:id` → Database delete

### State Management
- **Server State**: Managed by TanStack Query with automatic caching and invalidation
- **Form State**: Managed by React Hook Form with Zod validation
- **UI State**: Local React state for modals, filters, and UI interactions

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: Via `@neondatabase/serverless` driver
- **Configuration**: Database URL via environment variables

### UI Libraries
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Type safety across the application
- **ESBuild**: Production bundling for backend

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot reload
- **Backend**: tsx with auto-restart on file changes
- **Database**: Development database connection via DATABASE_URL

### Production
- **Frontend**: Static build output in `/dist/public`
- **Backend**: Compiled JavaScript bundle in `/dist`
- **Database**: Production PostgreSQL database
- **Server**: Express serves both API and static assets

### Build Process
1. Frontend build: `vite build` → static assets in `/dist/public`
2. Backend build: `esbuild` → compiled server in `/dist/index.js`
3. Database: `drizzle-kit push` for schema deployment

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment flag (development/production)
- **Session Configuration**: Express session settings

The application follows a standard full-stack architecture with clear separation between frontend, backend, and database layers. The shared schema approach ensures type safety and consistency across the entire application.