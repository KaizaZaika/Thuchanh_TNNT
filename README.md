# Product Recognition System

This is a product recognition system with a React frontend and Node.js backend, containerized with Docker.

## Prerequisites

- Docker (with Docker Compose)
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

## Project Structure

- `/frontend` - Contains the React frontend application
- `/backend` - Contains the Node.js backend server
- `/data` - Directory for persistent data

## Environment Variables

### Backend

Create a `.env` file in the `/backend` directory with the following variables:

```
PORT=3000
NODE_ENV=production
# Add other environment variables as needed
```

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where it's running, or run:

```bash
docker-compose down
```

## Development

For development, you can run the frontend and backend separately without Docker:

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```