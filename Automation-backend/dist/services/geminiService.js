"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = __importDefault(require("../utils/logger"));
class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    async generateTimetablePrompt(courses, subjects, teachers, classrooms) {
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
            logger_1.default.info('Sending prompt to Gemini API');
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            logger_1.default.info('Received response from Gemini API');
            let cleanedText = text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7, cleanedText.length - 3);
            }
            else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.substring(3, cleanedText.length - 3);
            }
            const timetable = JSON.parse(cleanedText);
            if (!Array.isArray(timetable)) {
                throw new Error('Gemini response is not an array');
            }
            for (const entry of timetable) {
                if (!entry.courseId || !entry.subjectId || !entry.teacherId ||
                    !entry.classroomId || !entry.day || !entry.startTime || !entry.endTime) {
                    throw new Error('Invalid timetable entry structure');
                }
            }
            logger_1.default.info(`Generated timetable with ${timetable.length} entries`);
            return timetable;
        }
        catch (error) {
            logger_1.default.error('Error generating timetable with Gemini:', error);
            return null;
        }
    }
}
exports.default = GeminiService;
//# sourceMappingURL=geminiService.js.map