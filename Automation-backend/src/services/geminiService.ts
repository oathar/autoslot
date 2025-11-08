import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import logger from '../utils/logger';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateTimetablePrompt(
    courses: any[],
    subjects: any[],
    teachers: any[],
    classrooms: any[]
  ): Promise<any[] | null> {
    try {
      const prompt = `
You are an AI scheduling assistant. 
Generate a weekly college timetable (Monday–Friday, 9AM–5PM) using the data below. 
Each course must have all its subjects scheduled with available teachers and classrooms. 
Avoid conflicts — no teacher or classroom can have overlapping sessions. 
Output a JSON array with objects containing:
courseId, subjectId, teacherId, classroomId, day, startTime, endTime.

Data:
Courses: ${JSON.stringify(courses)}
Subjects: ${JSON.stringify(subjects)}
Teachers: ${JSON.stringify(teachers)}
Classrooms: ${JSON.stringify(classrooms)}

Return ONLY a valid JSON array. No additional text or formatting.
`;

      logger.info('Sending prompt to Gemini API');
      const result: GenerateContentResult = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      logger.info('Received response from Gemini API');
      
      // Clean the response to extract only JSON
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7, cleanedText.length - 3);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3, cleanedText.length - 3);
      }
      
      // Parse the JSON
      const timetable = JSON.parse(cleanedText);
      
      // Validate the structure
      if (!Array.isArray(timetable)) {
        throw new Error('Gemini response is not an array');
      }
      
      // Validate each entry
      for (const entry of timetable) {
        if (!entry.courseId || !entry.subjectId || !entry.teacherId || 
            !entry.classroomId || !entry.day || !entry.startTime || !entry.endTime) {
          throw new Error('Invalid timetable entry structure');
        }
      }
      
      logger.info(`Generated timetable with ${timetable.length} entries`);
      return timetable;
    } catch (error: any) {
      logger.error('Error generating timetable with Gemini:', error);
      return null;
    }
  }
}

export default GeminiService;