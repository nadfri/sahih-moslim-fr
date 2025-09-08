# Sahih Moslim (French/English/Arabic) — Local Setup

## Overview

Sahih Moslim is a comprehensive collection of Imam Muslim's hadiths featuring French, English, and Arabic texts. The application supports advanced search functionality (by companion/sahaba, transmitter, hadith number) and preserves the complete isnad (transmission chain).

Key features include:

- Full-text search across multiple languages
- Structured data with ordered transmitters
- Admin interface for content management
- Role-based access control
- API endpoints for adding and editing hadiths

## Tech Stack & Prerequisites

### Technologies

- **Next.js 15** (App Router)
- **React 19** + React Compiler
- **TypeScript**
- **Prisma** (ORM)
- **Supabase** (Authentication + PostgreSQL Database)
- **Tailwind CSS 4**
- **Vitest** for testing
- **pnpm** as package manager

### Requirements

- Node.js (see `.nvmrc` for version)
- pnpm or npm
- Supabase project (for authentication and database)

## Configuration

### 1. Environment Variables

Copy the example environment file and configure the required variables:

```powershell
copy-item .env.example .env
```

**Required variables in `.env`:**

- `DATABASE_URL` — Direct Supabase PostgreSQL connection string (from Supabase Dashboard → Settings → Database → Connection string)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public/anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side service role key (optional, for admin operations)

**Test environment:**

- Copy `.env.test.example` to `.env.test` for test-specific configuration

### 2. Supabase Setup

#### Create Project

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Note your project URL and API keys from Settings → API

#### Configure Authentication

1. Go to Authentication → Settings
2. Add `http://localhost:3000` as an authorized redirect URL for local development
3. Configure GitHub OAuth (optional but recommended):
   - Go to Authentication → Providers
   - Enable GitHub provider
   - Add your GitHub OAuth App credentials

#### Database Configuration

1. The database connection is handled through the `DATABASE_URL`
2. Tables will be created via Prisma migrations (see Setup section)

## Installation & Setup

### 1. Install Dependencies

```powershell
pnpm install
```

### 2. Prisma Setup

#### Generate Prisma Client

```powershell
pnpm exec prisma generate
```

#### Apply Database Schema

Choose one of the following options:

**Option A — Migrations (Recommended for version control):**

```powershell
pnpm exec prisma migrate deploy
```

**Option B — Direct Push (Faster, no migration history):**

```powershell
pnpm exec prisma db push
```

#### Seed Initial Data (Optional)

The repository includes seed scripts for populating initial data:

```powershell
# Run migration and transmitter relation scripts
node prisma/seeds/migrate.js
node prisma/seeds/migrate-transmitters.js
node prisma/seeds/fillSlug.js
```

**Available seed files:**

- `prisma/seeds/chapters.js` — Book chapters
- `prisma/seeds/narrators.js` — Narrators data
- `prisma/seeds/sahabas.js` — Companions data

## Running the Application

### Development

```powershell
pnpm run dev
```

### Production Build

```powershell
pnpm run build
pnpm run start
```

The application will be available at `http://localhost:3000`.

## Testing

The project uses Vitest for testing with mocked Supabase authentication.

### Run Tests

```powershell
pnpm run test
# or directly
pnpm exec vitest
```

### Test Configuration

- Main test config: `vitest.config.mts`
- Example test: `app/api/hadiths/add/route.add.test.ts`
- Mock data utilities: `src/utils/mocks/mockHadiths.ts`

### Docker Environment

For isolated testing and development, you can use Docker to run a PostgreSQL database for testing.

#### Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

#### Quick Start with Docker

1. **Start the PostgreSQL database:**

   ```powershell
   docker-compose up -d
   ```

2. **Stop the database:**
   ```powershell
   docker-compose down
   ```

#### Docker Services

The `docker-compose.yml` file defines the following service:

- **postgres**: PostgreSQL 15 database for testing
  - Database name: `test_db`
  - Username: `test_user`
  - Password: `test_password`
  - Accessible on port 5432
  - Data persists in a Docker volume

#### Environment Configuration for Docker

Use your existing `.env.test` file and modify the `DATABASE_URL` to point to the Docker database:

```bash
# For Docker PostgreSQL
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/test_db"

# Keep your Supabase variables for auth
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

#### Docker Testing Workflow

1. **Start the database:**

   ```powershell
   docker-compose up -d
   ```

2. **Run tests with Docker database:**

   ```powershell
   # Tests will use the Docker PostgreSQL
   pnpm run test
   ```

3. **View database logs:**

   ```powershell
   docker-compose logs -f postgres
   ```

4. **Reset database (remove volume):**
   ```powershell
   docker-compose down -v
   docker-compose up -d
   ```

#### Docker Commands Reference

```powershell
# Start database in background
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose down

# Reset database (removes all data)
docker-compose down -v

# View running containers
docker-compose ps
```

**Note:** The Docker setup provides an isolated PostgreSQL database for testing. Your application runs locally while connecting to the Docker database.

## Admin Features

The admin interface (`/admin`) provides comprehensive data management capabilities, accessible only to users with `ADMIN` role.

### Key Features

- **Data Overview**: Statistics dashboard showing counts of hadiths, chapters, sahabas, and transmitters
- **Entity Management**: Add, edit, and manage chapters, companions (sahabas), and transmitters
- **Filtered Editing**: Advanced filtering for editing specific items
- **Role-Based Access**: Restricted to `ADMIN` users only

### Main Components

- `AdminDashboard` — Main dashboard orchestrator
- `DataManagement` — Statistics and data overview
- `AddItemForm` — Form for adding new entities
- `FilteredCardsEdit` — Filtered editing interface

### API Endpoints

- `POST /api/hadiths/add` — Add new hadith
- `PATCH /api/hadiths/edit/[id]` — Edit existing hadith

## Authentication & Security

### Authentication Flow

The application uses Supabase Authentication with GitHub OAuth:

1. **Sign In**: Users authenticate via `/auth/signin` page
2. **OAuth Callback**: `/auth/callback` handles the OAuth response
3. **Session Management**: Automatic session handling via Supabase
4. **Role Verification**: Admin role checked from user metadata or database

### Middleware Protection

The middleware (`middleware.ts`) secures sensitive routes:

- **Protected Routes**: `/admin`, `/*/add`, `/*/edit`
- **Authentication**: Redirects to sign-in for unauthenticated users
- **Authorization**: Verifies `ADMIN` role access
- **Fallback**: Checks both Supabase metadata and database profiles

### Key Authentication Files

- `middleware.ts` — Route protection middleware
- `src/lib/auth/auth.ts` — Server-side auth helpers
- `src/lib/auth/supabase/server.ts` — Supabase server client
- `app/auth/signin/page.tsx` — Sign-in page
- `app/auth/callback/route.ts` — OAuth callback handler

## Troubleshooting & Emergency Restore

### Common Issues

#### Database Connection

- Verify `DATABASE_URL` is correct (Supabase direct connection string)
- Ensure Supabase allows external connections
- Check network connectivity

#### Authentication Problems

- Confirm redirect URLs in Supabase Auth settings match your local setup
- Verify API keys are correctly set in environment variables
- Check GitHub OAuth configuration if using OAuth

#### Migration Issues

- Use seed helpers for transmitter relation migrations:
  ```powershell
  node prisma/seeds/migrate-transmitters.js
  node prisma/seeds/migrate.js
  ```

### Emergency Database Restore

In case of critical database issues, use the emergency restore script:

```powershell
node backups/restore-emergency.cjs
```

**Features:**

- Interactive restoration from `.dump` or `.sql` backup files
- Compatible with simplified Prisma schema
- Supports many-to-many relations (Hadith ↔ Sahaba)
- Automatic backup file detection and sorting by date

**Available backups:**

- Located in `backups/` directory
- Files: `*.dump` or `*.sql` format
- Latest backup: `sahih-muslim-fr-backup-2025-09-05-16-29-43.dump`

**Note:** Always backup current data before running restore operations.

## Key Files & References

### Core API Routes

- `app/api/hadiths/add/route.ts` — Add hadith endpoint
- `app/api/hadiths/edit/[id]/route.ts` — Edit hadith endpoint

### Configuration Files

- `package.json` — Project dependencies and scripts
- `next.config.ts` — Next.js configuration
- `vitest.config.mts` — Test configuration
- `prisma/schema.prisma` — Database schema

### Utilities & Helpers

- `src/utils/mocks/mockHadiths.ts` — Mock data for testing
- `src/utils/wrapProphetNames.ts` — Text processing utilities
- `prisma/seeds/` — Database seeding scripts

### UI Components

- `src/ui/Descriptive/Descriptive.tsx` — Example component
- `app/narrators/[slug]/page.tsx` — Example page route

### Supabase Integration

- `supabase/` — Supabase configuration directory
- `.env.example` — Environment variables template
- `.env.test.example` — Test environment template

This README provides comprehensive setup and usage instructions. For detailed implementation specifics, refer to the linked files above.
