# Dance App - Project Memory

## Project Overview

This is a comprehensive dance school management system built with Next.js 14, React, TypeScript, and TailwindCSS. The app manages dance schools as workspaces with member management, class scheduling, and subscription billing.

## Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **UI Components**: Shadcn/ui component library
- **State Management**: React Query + custom hooks for API state
- **Authentication**: JWT tokens with refresh mechanism
- **Database**: Multi-tenant architecture with workspace isolation

## Key Features

- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Workspaces**: Multi-tenant dance school organizations
- **Members**: Student profiles with skill levels and dance roles
- **Classes**: Scheduling with multiple dance types (Salsa, Bachata, Merengue, Kizomba, Cha Cha)
- **Subscriptions**: Package-based billing with analytics
- **Dashboard**: Comprehensive analytics and metrics

## Code Conventions

- Use TypeScript strict mode
- Follow existing component patterns in `components/` directory
- API routes in `app/api/` follow RESTful conventions
- Custom hooks in `hooks/` for data fetching and business logic
- Shared types in `types/index.ts`

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## File Structure Notes

- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks for data and state management
- `lib/` - Utilities and shared logic
- `types/` - TypeScript type definitions
