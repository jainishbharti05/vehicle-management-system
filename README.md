# Vehicle Service Management System (Express.js)

This is an Express.js backend for a vehicle service management system, using PostgreSQL and Docker Compose.

## Features
- RESTful API endpoints for users, vehicles, and services
- Audit logging for key actions
- PostgreSQL integration
- Docker & Docker Compose support
- Environment variable support via `.env`

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started/)
- [Node.js](https://nodejs.org/) (for local development)

### Running with Docker Compose
```bash
docker-compose up --build
```
The API will be available at http://localhost:3000

### Local Development
```bash
cp .env.example .env
npm install
npm run dev
```

## API Endpoints
- `GET /` — Health check
- (Add endpoints for users, vehicles, services)

## Audit Logging
All key actions (user registration, vehicle creation, service scheduling, status updates) are logged for auditing.

## License
MIT
