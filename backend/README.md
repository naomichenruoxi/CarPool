# Pathr Backend

Node.js + Express + Prisma + Supabase (PostgreSQL) backend for the Pathr Application.

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
- `GET /api/trips`: List trips (supports filters, including detour match).
- `GET /api/trips/:id`: Trip details.
- `PUT /api/trips/:id`: Update a trip (driver).
- `DELETE /api/trips/:id`: Delete a trip (driver).
- `POST /api/bookings`: Book a seat.
- `GET /api/bookings/me`: List my bookings.
- `DELETE /api/bookings/:id`: Cancel a booking.
- `POST /api/ratings`: Create a rating.
- `GET /api/ratings/user/:id`: Ratings for a user.
- `GET /api/ratings/me`: Ratings for current user.
- `GET /api/routes/estimate`: Driving distance and polyline (Google Directions).
