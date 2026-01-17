# Carpool Backend

Node.js + Express + Prisma + Supabase (PostgreSQL) backend for the Carpool Application.

## Service Features
- **Authentication**: JWT verification via Supabase.
- **Users**: Profile management and "Vibe Check" (Personality Profile).
- **Trips**: Drivers post rides, passengers search for them.
- **Reviews**: (Planned) User ratings.

## Setup

1.  **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in `backend/` with the following:
    ```env
    PORT=3000
    DATABASE_URL="postgresql://..."
    DIRECT_URL="postgresql://..."
    SUPABASE_URL="https://..."
    SUPABASE_KEY="your-anon-key"
    ```

3.  **Database Migration**
    Push the Prisma schema to your Supabase project:
    ```bash
    npx prisma db push
    ```

4.  **Run Server**
    ```bash
    npm start
    # OR for development
    npm run dev
    ```

## API Endpoints
- `POST /api/users/sync`: Create user in DB after Supabase Auth.
- `GET /api/users/me`: Get current user profile.
- `PUT /api/users/profile`: Update personality profile.
- `POST /api/trips`: Create a new trip.
- `GET /api/trips`: List all trips.
