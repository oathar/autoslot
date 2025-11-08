import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function generateSampleTimetable() {
  try {
    // Clear existing timetable entries
    await prisma.timetable.deleteMany({});
    logger.info('Cleared existing timetable entries');

    // Fetch all required data
    const courses = await prisma.course.findMany();
    const subjects = await prisma.subject.findMany();
    const teachers = await prisma.teacher.findMany();
    const classrooms = await prisma.classroom.findMany();
    
    logger.info(`Fetched data: ${courses.length} courses, ${subjects.length} subjects, ${teachers.length} teachers, ${classrooms.length} classrooms`);

    // Generate sample timetable entries manually
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' }
    ];

    // Create sample timetable entries
    const timetableEntries = [];
    
    for (let i = 0; i < Math.min(courses.length * 2, days.length * timeSlots.length); i++) {
      const courseId = courses[i % courses.length].id;
      const subjectId = subjects[i % subjects.length].id;
      const teacherId = teachers[i % teachers.length].id;
      const classroomId = classrooms[i % classrooms.length].id;
      const day = days[i % days.length];
      const timeSlot = timeSlots[i % timeSlots.length];
      
      timetableEntries.push({
        courseId,
        subjectId,
        teacherId,
        classroomId,
        day,
        startTime: timeSlot.start,
        endTime: timeSlot.end
      });
    }

    // Insert timetable entries
    for (const entry of timetableEntries) {
      await prisma.timetable.create({
        data: entry
      });
    }

    logger.info(`Successfully generated and stored sample timetable with ${timetableEntries.length} entries`);
    console.log(`Sample timetable with ${timetableEntries.length} entries has been generated.`);
    
    // Display some entries
    const sampleEntries = await prisma.timetable.findMany({
      take: 5
    });
    
    console.log('\nSample timetable entries:');
    sampleEntries.forEach(entry => {
      console.log(`${entry.day} ${entry.startTime}-${entry.endTime}: Subject ID ${entry.subjectId} (Teacher ID ${entry.teacherId}) in Classroom ID ${entry.classroomId}`);
    });
  } catch (error) {
    logger.error('Error generating sample timetable:', error);
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSampleTimetable();