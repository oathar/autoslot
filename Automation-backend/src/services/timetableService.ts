import prisma from '../utils/prismaClient';
import GeminiService from './geminiService';
import logger from '../utils/logger';

class TimetableService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async generateTimetable(): Promise<boolean> {
    try {
      logger.info('Fetching data from database');
      
      // Fetch all required data
      const courses = await prisma.course.findMany();
      const subjects = await prisma.subject.findMany();
      const teachers = await prisma.teacher.findMany();
      const classrooms = await prisma.classroom.findMany();
      
      logger.info(`Fetched data: ${courses.length} courses, ${subjects.length} subjects, ${teachers.length} teachers, ${classrooms.length} classrooms`);
      
      // Generate timetable using Gemini
      const timetable = await this.geminiService.generateTimetablePrompt(
        courses,
        subjects,
        teachers,
        classrooms
      );
      
      if (!timetable) {
        logger.error('Failed to generate timetable with Gemini');
        return false;
      }
      
      // Clear existing timetable entries
      await prisma.timetable.deleteMany({});
      logger.info('Cleared existing timetable entries');
      
      // Validate and insert timetable entries
      for (const entry of timetable) {
        // Validate foreign keys exist
        const courseExists = await prisma.course.findUnique({
          where: { id: entry.courseId }
        });
        
        const subjectExists = await prisma.subject.findUnique({
          where: { id: entry.subjectId }
        });
        
        const teacherExists = await prisma.teacher.findUnique({
          where: { id: entry.teacherId }
        });
        
        const classroomExists = await prisma.classroom.findUnique({
          where: { id: entry.classroomId }
        });
        
        if (!courseExists || !subjectExists || !teacherExists || !classroomExists) {
          logger.warn(`Skipping invalid timetable entry: ${JSON.stringify(entry)}`);
          continue;
        }
        
        // Insert the timetable entry
        await prisma.timetable.create({
          data: {
            courseId: entry.courseId,
            subjectId: entry.subjectId,
            teacherId: entry.teacherId,
            classroomId: entry.classroomId,
            day: entry.day,
            startTime: entry.startTime,
            endTime: entry.endTime
          }
        });
      }
      
      logger.info(`Successfully generated and stored timetable with ${timetable.length} entries`);
      return true;
    } catch (error: any) {
      logger.error('Error in generateTimetable:', error);
      return false;
    }
  }

  async getAllTimetableEntries() {
    try {
      const timetableEntries = await prisma.timetable.findMany({
        orderBy: [
          { day: 'asc' },
          { startTime: 'asc' }
        ]
      });
      
      return timetableEntries;
    } catch (error: any) {
      logger.error('Error fetching timetable entries:', error);
      throw error;
    }
  }

  async clearTimetable() {
    try {
      await prisma.timetable.deleteMany({});
      logger.info('Cleared all timetable entries');
      return true;
    } catch (error: any) {
      logger.error('Error clearing timetable:', error);
      throw error;
    }
  }
}

export default TimetableService;