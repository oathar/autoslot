import express, { Request, Response } from 'express';
import TimetableService from '../services/timetableService';
import logger from '../utils/logger';

const router = express.Router();
const timetableService = new TimetableService();

// POST /generate-timetable - Generate a new timetable
router.post('/generate-timetable', async (req: Request, res: Response) => {
  try {
    logger.info('Received request to generate timetable');
    
    const success = await timetableService.generateTimetable();
    
    if (success) {
      res.status(200).json({ 
        message: 'Timetable generated and stored successfully' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate timetable' 
      });
    }
  } catch (error: any) {
    logger.error('Error in /generate-timetable route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /timetable - Get all timetable entries
router.get('/timetable', async (req: Request, res: Response) => {
  try {
    logger.info('Received request to fetch timetable');
    
    const timetableEntries = await timetableService.getAllTimetableEntries();
    
    res.status(200).json({
      message: 'Timetable entries fetched successfully',
      data: timetableEntries
    });
  } catch (error: any) {
    logger.error('Error in /timetable route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// DELETE /timetable - Clear all timetable entries
router.delete('/timetable', async (req: Request, res: Response) => {
  try {
    logger.info('Received request to clear timetable');
    
    await timetableService.clearTimetable();
    
    res.status(200).json({
      message: 'Timetable cleared successfully'
    });
  } catch (error: any) {
    logger.error('Error in /timetable DELETE route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

export default router;