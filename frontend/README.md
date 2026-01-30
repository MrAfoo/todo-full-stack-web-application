# Todo Frontend

Next.js 14 frontend for the full-stack todo application with TypeScript and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔐 JWT-based authentication
- ⚡ Server-side rendering with Next.js App Router
- 📱 Responsive design
- ✅ Task management (CRUD operations)
- 🧪 Comprehensive test coverage with Jest

## Requirements

- Node.js 18+ 
- npm or yarn or pnpm

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your backend API URL (default: http://localhost:8000)
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at: http://localhost:3000

## Development

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── dashboard/           # Main dashboard (protected)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── auth/                # Authentication components
│   ├── tasks/               # Task components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── api.ts               # API client with axios
│   ├── auth.ts              # Authentication utilities
│   └── types.ts             # TypeScript type definitions
├── hooks/
│   └── useTasks.ts          # Custom hooks for task management
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000` by default.

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (required)

## Features

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Protected routes with middleware
- Automatic token refresh

### Task Management
- Create new tasks
- View all tasks
- Update task details
- Mark tasks as complete/incomplete
- Delete tasks
- Real-time updates

### UI/UX
- Clean, modern interface
- Loading states
- Error handling
- Form validation
- Responsive design (mobile-friendly)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **State Management**: React hooks + Context API

## Contributing

Follow the project's coding standards:
- Use TypeScript for type safety
- Follow the Next.js App Router conventions
- Write tests for new features
- Use Tailwind for styling (no custom CSS unless necessary)
