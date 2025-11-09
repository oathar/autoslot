import logger from '../utils/logger';

async function testGenerateTimetable() {
  try {
    console.log('Testing timetable generation...');
    
    const response = await fetch('http://localhost:8000/api/generate-timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Generation result:', result);
    
  } catch (error) {
    logger.error('Error testing timetable generation:', error);
    console.error('Error:', error);
  }
}

testGenerateTimetable();