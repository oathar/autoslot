# Automation Backend Usage

## Getting Started

1. Make sure PostgreSQL is running on your system
2. Ensure the database is set up with the correct schema
3. Start the automation backend server:
   ```bash
   cd /Users/adityajagrani/Desktop/autoslot/Automation-backend
   npm run dev
   ```

## API Endpoints

### Timetable Management

- `GET /api/timetable` - Get all timetable entries
- `GET /api/timetable/with-details` - Get all timetable entries with related data (courses, subjects, teachers, classrooms)
- `POST /api/generate-sample-timetable` - Generate sample timetable data without AI
- `DELETE /api/timetable` - Clear all timetable entries

### Health Check

- `GET /health` - Check if the server is running

## Sample Data

The automation backend comes with sample data scripts to populate the database with test data:

1. `npm run seed` - Populate the database with sample courses, subjects, teachers, and classrooms
2. `npm run generate-sample-timetable` - Generate sample timetable entries

## Frontend Integration

The frontend can communicate with the automation backend through the following endpoints:

- Timetable data: `http://localhost:8000/api/timetable/with-details`
- Generate timetable: `http://localhost:8000/api/generate-sample-timetable`
- Clear timetable: `http://localhost:8000/api/timetable` (DELETE method)

## Testing

You can test the API endpoints using curl:

```bash
# Get timetable data
curl http://localhost:8000/api/timetable/with-details

# Generate sample timetable
curl -X POST http://localhost:8000/api/generate-sample-timetable

# Clear timetable
curl -X DELETE http://localhost:8000/api/timetable
```