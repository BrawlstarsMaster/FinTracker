# FinTrack

FinTrack is a finance tracking web application that helps users manage personal income, expenses, savings goals, and investments. It is built with React, Node.js, Express, and PostgreSQL, and is fully containerized with Docker.

## Features
- User registration and secure login
- Add, edit, and categorize income and expenses
- Set savings goals and track progress
- Visualize monthly financial status via graphs
- Admin dashboard for user management and reports

## Tech Stack
- Frontend: React + TailwindCSS
- Backend: Node.js + Express.js
- Database: PostgreSQL (via Sequelize ORM)
- DevOps: Docker, GitHub Actions
- API Docs: Swagger

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (if running locally)

### Quick Start (Docker Compose)
```bash
git clone <repo-url>
cd rs
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

### Environment Variables
Copy `.env.example` to `.env` in both `/backend` and `/frontend` and fill in the required values.

## Documentation
- [API Docs (Swagger)](backend/swagger.yaml)
- [Admin Guide](docs/admin_guide.md)
- [User Guide](docs/user_guide.md)

## Testing
- Backend: `npm test` in `/backend`
- Frontend: `npm test` in `/frontend`

## License
MIT 