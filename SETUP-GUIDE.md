# Full-Stack Todo Application - Setup Guide

Complete step-by-step guide to set up and run the full-stack todo application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+**: Check with `python --version`
- **Node.js 18+**: Check with `node --version`
- **PostgreSQL 14+**: Check with `psql --version`
- **UV** (recommended): Install with `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **npm** (comes with Node.js)

## Step 1: Clone and Navigate

```bash
# If you haven't already cloned the repository
git clone <your-repo-url>
cd <your-repo-name>
```

## Step 2: Database Setup

### Install PostgreSQL

**macOS** (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL prompt, create database
CREATE DATABASE todo_db;

# Create a user (optional)
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;

# Exit PostgreSQL
\q
```

Or use the command line:
```bash
createdb todo_db
```

## Step 3: Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies

**Using UV (Recommended)**:
```bash
uv sync
```

**Using pip**:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your settings:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-min-32-characters-long-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Configuration
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Important**: Generate a secure SECRET_KEY for production:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Run Database Migrations

```bash
# Apply migrations to create tables
uv run alembic upgrade head
```

### 5. Start Backend Server

```bash
# Development server with auto-reload
uv run uvicorn app.main:app --reload --port 8000
```

The backend should now be running at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### 6. Verify Backend (Optional)

Test the API:
```bash
# Health check
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

## Step 4: Frontend Setup

### 1. Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
# or: yarn install
# or: pnpm install
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.local.example .env.local
```

The default configuration should work:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running at:
- http://localhost:3000

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

## Step 5: Create Your First User

1. **Navigate to** http://localhost:3000
2. **Click** "Create a new account"
3. **Fill in the registration form**:
   - Username: Choose a username (min 3 characters)
   - Email: Enter your email
   - Password: Choose a password (min 8 characters)
4. **Click** "Create account"
5. You'll be automatically logged in and redirected to the dashboard

## Step 6: Verify Everything Works

1. **Create a task**:
   - Click "Add New Task"
   - Enter a title and description
   - Click "Create Task"

2. **Manage tasks**:
   - Check the checkbox to mark as complete
   - Click "Edit" to modify a task
   - Click "Delete" to remove a task

3. **Test authentication**:
   - Click "Logout"
   - Login again with your credentials

## Running Tests

### Backend Tests

```bash
cd backend
uv run pytest
uv run pytest --cov-report=html  # With coverage report
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:watch  # Watch mode
```

## Troubleshooting

### Backend Issues

**"Connection refused" error**:
- Ensure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env`

**"Relation does not exist" error**:
- Run migrations: `uv run alembic upgrade head`

**Import errors**:
- Ensure dependencies are installed: `uv sync`

### Frontend Issues

**"Cannot connect to API" error**:
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in `.env.local`

**"Module not found" error**:
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Delete .next folder: `rm -rf .next`

**Port 3000 already in use**:
- Run on different port: `npm run dev -- -p 3001`

### Database Issues

**Cannot create database**:
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL service
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
# Windows: Start via Services manager
```

**Permission denied**:
```bash
# Grant permissions
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE todo_db TO your_user;
```

## Development Workflow

### Making Database Changes

1. **Modify models** in `backend/app/models/`
2. **Create migration**:
   ```bash
   cd backend
   uv run alembic revision --autogenerate -m "description of changes"
   ```
3. **Review migration** in `backend/alembic/versions/`
4. **Apply migration**:
   ```bash
   uv run alembic upgrade head
   ```

### Code Quality

**Backend**:
```bash
cd backend
uv run black app tests      # Format
uv run flake8 app tests     # Lint
uv run mypy app             # Type check
```

**Frontend**:
```bash
cd frontend
npm run lint                # Lint
npm run build               # Production build
```

## Production Deployment

### Backend

1. **Update environment variables**:
   - Set DEBUG=False
   - Use strong SECRET_KEY
   - Update ALLOWED_ORIGINS
   - Use production database

2. **Run with production server**:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## Next Steps

- Explore the API docs at http://localhost:8000/docs
- Read the specification: `spec-fullstack-todo-web-app.md`
- Check the implementation plan: `plan-fullstack-todo-web-app.md`
- Review the codebase and tests

## Getting Help

- Check the main README: [README-FULLSTACK.md](./README-FULLSTACK.md)
- Review backend docs: [backend/README.md](./backend/README.md)
- Review frontend docs: [frontend/README.md](./frontend/README.md)
- Check API documentation at http://localhost:8000/docs

Happy coding! 🚀
