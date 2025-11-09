"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const geminiService_1 = __importDefault(require("./geminiService"));
const logger_1 = __importDefault(require("../utils/logger"));
class TimetableService {
    constructor() {
        this.geminiService = new geminiService_1.default();
    }
    async generateTimetable() {
        try {
            logger_1.default.info('Fetching data from database');
            const courses = await prismaClient_1.default.course.findMany();
            const subjects = await prismaClient_1.default.subject.findMany({
                include: {
                    course: true
                }
            });
            const teachers = await prismaClient_1.default.teacher.findMany();
            const classrooms = await prismaClient_1.default.classroom.findMany();
            logger_1.default.info(`Fetched data: ${courses.length} courses, ${subjects.length} subjects, ${teachers.length} teachers, ${classrooms.length} classrooms`);
            const timetable = await this.geminiService.generateTimetablePrompt(courses, subjects, teachers, classrooms);
            if (!timetable) {
                logger_1.default.error('Failed to generate timetable with Gemini');
                return false;
            }
            await prismaClient_1.default.timetable.deleteMany({});
            logger_1.default.info('Cleared existing timetable entries');
            for (const entry of timetable) {
                const courseExists = await prismaClient_1.default.course.findUnique({
                    where: { id: entry.courseId }
                });
                const subjectExists = await prismaClient_1.default.subject.findUnique({
                    where: { id: entry.subjectId }
                });
                const teacherExists = await prismaClient_1.default.teacher.findUnique({
                    where: { id: entry.teacherId }
                });
                const classroomExists = await prismaClient_1.default.classroom.findUnique({
                    where: { id: entry.classroomId }
                });
                if (!courseExists || !subjectExists || !teacherExists || !classroomExists) {
                    logger_1.default.warn(`Skipping invalid timetable entry: ${JSON.stringify(entry)}`);
                    continue;
                }
                await prismaClient_1.default.timetable.create({
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
            logger_1.default.info(`Successfully generated and stored timetable with ${timetable.length} entries`);
            return true;
        }
        catch (error) {
            logger_1.default.error('Error in generateTimetable:', error);
            return false;
        }
    }
    async getAllTimetableEntries() {
        try {
            const timetableEntries = await prismaClient_1.default.timetable.findMany({
                include: {
                    course: true,
                    subject: true,
                    teacher: true,
                    classroom: true
                },
                orderBy: [
                    { day: 'asc' },
                    { startTime: 'asc' }
                ]
            });
            return timetableEntries;
        }
        catch (error) {
            logger_1.default.error('Error fetching timetable entries:', error);
            throw error;
        }
    }
    async clearTimetable() {
        try {
            await prismaClient_1.default.timetable.deleteMany({});
            logger_1.default.info('Cleared all timetable entries');
            return true;
        }
        catch (error) {
            logger_1.default.error('Error clearing timetable:', error);
            throw error;
        }
    }
}
exports.default = TimetableService;
//# sourceMappingURL=timetableService.js.map