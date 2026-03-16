# Task Management Application

This is a production-ready Task Management Application built with Node.js, Express, PostgreSQL (Neon DB), Prisma, and Next.js.

## Tech Stack
-   **Backend:** Node.js, Express, Prisma ORM, PostgreSQL (Neon DB)
-   **Frontend:** Next.js (Pages router), TailwindCSS, Axios
-   **Authentication:** JWT, HttpOnly Cookies, AES Encryption (for password in transit)
-   **Security:** bcrypt, helmet, cors

## Folder Structure
We have separated the application into `backend/` and `frontend/` directories.

## Running Locally

### 1. Setup Backend
1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Install all dependencies:
    ```bash
    npm install
    ```
3.  Check and Configure the `.env` file! A default `.env` is already created with the provided Neon database URL and JWT/encryption secrets.
4.  Generate Prisma client and push the schema to PostgreSQL:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
5.  Start the backend server in development mode:
    ```bash
    npm run dev
    ```

### 2. Setup Frontend
1.  Open a new terminal window/tab.
2.  Navigate into the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install all dependencies:
    ```bash
    npm install
    ```
4.  Start the Next.js development server:
    ```bash
    npm run dev
    ```

### 3. Usage
-   The Frontend should be running at `http://localhost:3000`
-   The Backend API should be running at `http://localhost:5000`
-   Go to `http://localhost:3000` to register a new user, log in, and begin managing tasks.

## Key Features Implemented
-   **Structured API Design**: Clear folder separation for Controllers, Services, Middlewares, Utilities, and Routes.
-   **Secure Authentication**: Passwords hashed via bcrypt, tokens delivered purely in HTTP-only cookies, password payload encrypted via AES.
-   **Pagination, Search, Filtering**: Fully functional in backend and linked via queries.
-   **Private Tasks**: Prisma limits queries directly via user relationships (`userId` in where clauses).
-   **SQL Injection Prevention**: Using Prisma completely mitigates standard SQL injections.
