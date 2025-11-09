import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function fetchRelatedData() {
  try {
    // Fetch all related data
    const courses = await prisma.course.findMany();
    const subjects = await prisma.subject.findMany();
    const teachers = await prisma.teacher.findMany();
    const classrooms = await prisma.classroom.findMany();
    
    console.log('Courses:');
    courses.forEach(course => {
      console.log(`  ${course.id}: ${course.name} (Semester ${course.semester}, ${course.totalStudents} students)`);
    });
    
    console.log('\nSubjects:');
    subjects.forEach(subject => {
      console.log(`  ${subject.id}: ${subject.name} (${subject.hoursPerWeek} hours/week)`);
    });
    
    console.log('\nTeachers:');
    teachers.forEach(teacher => {
      console.log(`  ${teacher.id}: ${teacher.name} (Max ${teacher.maxHoursPerWeek} hours/week)`);
    });
    
    console.log('\nClassrooms:');
    classrooms.forEach(classroom => {
      console.log(`  ${classroom.id}: ${classroom.name} (Capacity: ${classroom.capacity}${classroom.features ? `, Features: ${classroom.features}` : ''})`);
    });
    
  } catch (error) {
    logger.error('Error fetching related data:', error);
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchRelatedData();