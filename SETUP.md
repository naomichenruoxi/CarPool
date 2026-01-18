# Project Setup Guide

Follow these steps to set up and run the Pathr application on a new machine.

## Prerequisites
-   **Node.js** (v18 or higher)
-   **Git**
-   **Terminal**

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Pathr
```

## 2. Backend Setup
The backend runs on port `3000`.

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=3000
    # Copy these keys from your Supabase Project Settings
    DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
    DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
    SUPABASE_URL="https://[ref].supabase.co"
    SUPABASE_KEY="[service-role-key]" 
    GEMINI_API_KEY="[your-gemini-key]"
    ```
    > **Note:** The `SUPABASE_KEY` here should be the **Service Role Key** (starts with `sb_secret` or `eyJ...` if using JWTs, but usually service role for backend admin tasks) for full access, or at least a key with permissions to write to your DB.

4.  **Sync Database Schema:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start Server:**
    ```bash
    npm run dev
    ```
    *Keep this terminal open.*

## 3. Frontend Setup
The frontend runs on port `5174` (or `5173`).

1.  **Open a NEW terminal window/tab.**

2.  **Navigate to frontend:**
    ```bash
    cd frontend/carpool-connect-main
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Environment:**
    Create a `.env` file in the `frontend/carpool-connect-main/` directory:
    ```env
    VITE_SUPABASE_URL="https://[ref].supabase.co"
    VITE_SUPABASE_KEY="[anon-public-key]"
    VITE_GOOGLE_MAPS_API_KEY="[your-google-maps-key]"
    ```
    > **Note:** This key is safe to be public (starts with `eyJ...`).

5.  **Start Application:**
    ```bash
    npm run dev
    ```

6.  **Open in Browser:**
    Go to `http://localhost:5174` (or the port shown in the terminal).
