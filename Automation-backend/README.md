# Automation Backend

Node.js backend for auto-generating college timetables using the Gemini API.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database setup**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Get a Google Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an account or sign in
   - Navigate to "API Keys" in the sidebar
   - Create a new API key
   - Copy the API key

4. **Configure environment variables**:
   - Update the `.env` file with your actual:
     - DATABASE_URL (already configured for your local PostgreSQL)
     - GEMINI_API_KEY (the key you just created)

5. **Run the server**:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Health check
- `POST /api/generate-timetable` - Generate and store timetable
- `GET /api/timetable` - Retrieve all timetable entries
- `DELETE /api/timetable` - Clear timetable entries

## Seeding Sample Data

Run the seed script to populate sample data:
```bash
npx ts-node src/scripts/seedData.ts
```