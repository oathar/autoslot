import express, { Request, Response } from 'express';
import TimetableService from '../services/timetableService';
import logger from '../utils/logger';
import prisma from '../utils/prismaClient';

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

// GET /timetable/with-details - Get all timetable entries with related data
router.get('/timetable/with-details', async (req: Request, res: Response) => {
  try {
    logger.info('Received request to fetch timetable with details');
    
    // Fetch all related data
    const [courses, subjects, teachers, classrooms, teacherSubjects, timetableEntries] = await Promise.all([
      prisma.course.findMany(),
      prisma.subject.findMany(),
      prisma.teacher.findMany(),
      prisma.classroom.findMany(),
      prisma.teacherSubject.findMany(),
      timetableService.getAllTimetableEntries()
    ]);
    
    res.status(200).json({
      message: 'Timetable data fetched successfully',
      data: {
        timetableEntries,
        courses,
        subjects,
        teachers,
        classrooms,
        teacherSubjects
      }
    });
  } catch (error: any) {
    logger.error('Error in /timetable/with-details route:', error);
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

// POST /generate-sample-timetable - Generate sample timetable without AI
router.post('/generate-sample-timetable', async (req: Request, res: Response) => {
  try {
    logger.info('Received request to generate sample timetable');
    
    // Import the function dynamically to avoid circular dependencies
    const { default: generateSampleTimetableWithoutAI } = await import('../scripts/generateSampleTimetableWithoutAI');
    
    const success = await generateSampleTimetableWithoutAI();
    
    if (success) {
      res.status(200).json({ 
        message: 'Sample timetable generated and stored successfully' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate sample timetable' 
      });
    }
  } catch (error: any) {
    logger.error('Error in /generate-sample-timetable route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

export default router;