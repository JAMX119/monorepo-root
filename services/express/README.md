# Express Service

This is an Express.js service built with TypeScript for the monorepo.

## Overview

This service provides a RESTful API backend using Express.js and TypeScript.
It's designed to be part of a monorepo structure and can be integrated with other services and applications.

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Typed superset of JavaScript
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node-dev** - Development server with hot reloading

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

#### From Monorepo Root

```bash
# Install dependencies
pnpm install

# Run the service in development mode
pnpm dev --filter express-service
```

#### From Direct Directory

```bash
# Navigate to the service directory
cd services/express

# Install dependencies
pnpm install

# Run the service in development mode
pnpm dev
```

### Available Scripts

In the project directory, you can run:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Runs the app in development mode with hot reloading |
| `pnpm build` | Builds the app for production to the `dist` folder |
| `pnpm start` | Runs the production build from the `dist` folder |
| `pnpm lint` | Runs ESLint to check for code issues |
| `pnpm format` | Formats code using Prettier |

## Project Structure

```
src/
├── app.ts         # Express app configuration
└── index.ts       # Server entry point
dist/              # Compiled TypeScript files (generated after build)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT`   | Server port | 3000    |

## API Endpoints

### Health Check

- **GET** `/health`
  - Checks if the server is running
  - Returns: `{"status": "OK", "timestamp": "2023-10-01T12:00:00Z"}`

### Root Endpoint

- **GET** `/`
  - Basic endpoint to verify the server is running
  - Returns: `Express + TypeScript Server`

## Extending the Service

To add new routes:

1. Create a new routes file in the `src` directory
2. Import and use the routes in `app.ts`

Example:

```typescript
// src/routes/users.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/users', (req: Request, res: Response) => {
  res.json({ users: [] });
});

export default router;

// In src/app.ts
import userRoutes from './routes/users';

app.use('/api', userRoutes);
```

## Integration with Shared Packages

To use shared packages from the monorepo:

```bash
# Add the shared package as a dependency
pnpm add --workspace common-utils

# Then import and use it in your code
import { logger } from 'common-utils';
```

## Deployment

After building the service with `pnpm build`, deploy the `dist` folder along with `package.json` and `package-lock.json`.

## Notes

- This service is configured to work within the monorepo structure.
- Always run type checking with `npx tsc -b` before committing code.
- Follow the code style guidelines enforced by ESLint and Prettier.