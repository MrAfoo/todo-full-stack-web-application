# Todo Backend API

FastAPI backend for the full-stack todo application with JWT authentication and PostgreSQL database.

## Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- ✅ CRUD operations for tasks
- 🗄️ PostgreSQL database with SQLAlchemy ORM
- 🔄 Database migrations with Alembic
- 🧪 Comprehensive test coverage

## Requirements

- Python 3.13+
- PostgreSQL 14+
- UV (recommended) or pip

## Quick Start

### 1. Install Dependencies

```bash
cd backend
uv sync
```

### 2. Set Up Database

```bash
# Create PostgreSQL database
createdb todo_db

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
```

### 3. Run Database Migrations

```bash
uv run alembic upgrade head
```

### 4. Start Development Server

```bash
uv run uvicorn app.main:app --reload --port 8000
```

API will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

## Development

### Running Tests

```bash
uv run pytest
uv run pytest --cov-report=html  # Generate HTML coverage report
```

### Database Migrations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

### Code Quality

```bash
# Format code
uv run black app tests

# Lint
uv run flake8 app tests

# Type checking
uv run mypy app
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get task by ID
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic
│   └── middleware/          # Auth & CORS middleware
├── tests/                   # Test files
├── alembic/                 # Database migrations
├── pyproject.toml
└── README.md
```
