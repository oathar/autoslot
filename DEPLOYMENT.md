# AutoSlot Deployment Guide

This guide provides instructions for deploying the AutoSlot application to production.

## Project Structure

The AutoSlot application consists of three main components:

1. **Frontend** - React + TypeScript application
2. **Backend** - Main Express.js backend with PostgreSQL database
3. **Automation Backend** - Node.js backend for timetable generation with separate PostgreSQL database

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (two separate databases required)
- npm or yarn package manager

## Environment Variables

Each service requires specific environment variables. Copy the `.env.production` files and update them with your actual values:

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
JWT_SECRET=your_jwt_secret_here
PORT=5858
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

### Automation Backend (.env)
```
DATABASE_URL=postgresql://username:password@hostname:port/autoslot_automation
GEMINI_API_KEY=AIzaYOUR_API_KEY_HERE
PORT=8000
```

## Deployment Steps

### 1. Frontend Deployment

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve the built files (using any static file server)
npm run preview
```

For production deployment, serve the `dist` folder using a web server like Nginx or Apache.

### 2. Backend Deployment

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Build TypeScript files
npm run build

# Run the production server
npm start
```

### 3. Automation Backend Deployment

```bash
# Navigate to automation backend directory
cd Automation-backend

# Install dependencies
npm install

# Build TypeScript files
npm run build

# Run the production server
npm start
```

## Database Setup

### Backend Database
1. Create a PostgreSQL database
2. Update the DATABASE_URL in the backend .env file
3. Run Prisma migrations:
   ```bash
   cd Backend
   npx prisma migrate dev --name init
   ```

### Automation Backend Database
1. Create a separate PostgreSQL database named `autoslot_automation`
2. Update the DATABASE_URL in the automation backend .env file
3. Run Prisma migrations:
   ```bash
   cd Automation-backend
   npx prisma migrate dev --name init
   ```

## Render Deployment Configuration

### Main Backend (Web Service)
- Build Command: `npm install`
- Start Command: `npm run start`
- Environment Variables:
  - DATABASE_URL
  - JWT_SECRET
  - PORT

### Frontend (Static Site or Web Service)
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview`
- Environment Variables:
  - VITE_API_URL

### Automation Backend (Web Service)
- Build Command: `npm install`
- Start Command: `npm run start`
- Environment Variables:
  - DATABASE_URL
  - GEMINI_API_KEY
  - PORT

## Health Checks

Each service includes health check endpoints:

- Main Backend: `GET /` (root endpoint)
- Automation Backend: `GET /health`

Configure your deployment platform to use these endpoints for health monitoring.

## Additional Notes

1. Ensure all three services are running and accessible
2. Update CORS configurations in both backend services to allow your frontend domain
3. Secure all environment variables and API keys
4. Set up proper logging and monitoring for production
5. Consider using a process manager like PM2 for production deployments