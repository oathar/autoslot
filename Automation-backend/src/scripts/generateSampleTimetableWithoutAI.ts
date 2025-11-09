import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function generateSampleTimetableWithoutAI() {
  try {
    logger.info('Generating sample timetable without AI');
    
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
      // Break time 13:00-14:00 excluded
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
    ];
    
    // Create sample timetable entries - separate timetable for each degree
    const timetableEntries = [];
    
    // For each course/degree, create a separate timetable
    for (const course of courses) {
      // Filter subjects for this specific course
      const courseSubjects = subjects.filter(subject => subject.courseId === course.id);
      
      // For each day, create classes for this course
      for (const day of days) {
        // Create 6 classes per day for this course (excluding break time)
        for (let i = 0; i < 6; i++) {
          // Select subject for this course
          const subject = courseSubjects[i % courseSubjects.length];
          
          // Select teacher who teaches this subject
          const teacherSubject = await prisma.teacherSubject.findFirst({
            where: { subjectId: subject.id }
          });
          
          if (teacherSubject) {
            const teacherId = teacherSubject.teacherId;
            
            // Select classroom based on course and day to ensure variety
            // This will distribute classrooms across courses and days
            const classroomIndex = (course.id + days.indexOf(day) + i) % classrooms.length;
            const classroomId = classrooms[classroomIndex].id;
            
            // Select time slot (skip break time at index 4)
            const timeSlotIndex = i < 4 ? i : i + 1; // Skip index 4 (break time)
            const timeSlot = timeSlots[timeSlotIndex];
            
            timetableEntries.push({
              courseId: course.id,
              subjectId: subject.id,
              teacherId: teacherId,
              classroomId: classroomId,
              day: day,
              startTime: timeSlot.start,
              endTime: timeSlot.end
            });
          }
        }
      }
    }
    
    // Insert timetable entries
    for (const entry of timetableEntries) {
      await prisma.timetable.create({
        data: entry
      });
    }
    
    logger.info(`Successfully generated and stored sample timetable with ${timetableEntries.length} entries (${courses.length} courses × 5 days × 6 classes)`);
    console.log(`Sample timetable with ${timetableEntries.length} entries has been generated.`);
    
    return true;
  } catch (error) {
    logger.error('Error generating sample timetable:', error);
    console.error('Error:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateSampleTimetableWithoutAI()
    .then(success => {
      if (success) {
        console.log('Sample timetable generation completed successfully');
      } else {
        console.log('Sample timetable generation failed');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export default generateSampleTimetableWithoutAI;