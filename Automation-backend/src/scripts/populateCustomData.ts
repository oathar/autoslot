import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function populateCustomData() {
  try {
    logger.info('Clearing existing data');
    
    // Clear existing data in correct order to avoid foreign key constraints
    await prisma.timetable.deleteMany({});
    await prisma.teacherSubject.deleteMany({});
    await prisma.classroom.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.course.deleteMany({});
    
    logger.info('Existing data cleared');
    
    // Insert courses
    const coursesData = [
      {id: 1, name: "B.Tech Computer Science", totalStudents: 120, semester: 5},
      {id: 2, name: "B.Ed", totalStudents: 60, semester: 3},
      {id: 3, name: "BBA", totalStudents: 90, semester: 4},
      {id: 4, name: "BA English Literature", totalStudents: 80, semester: 2},
      {id: 5, name: "B.Sc Mathematics", totalStudents: 70, semester: 1}
    ];
    
    for (const course of coursesData) {
      await prisma.course.create({
        data: course
      });
    }
    
    logger.info(`Created ${coursesData.length} courses`);
    
    // Insert subjects
    const subjectsData = [
      {id: 1, name: "Data Structures & Algorithms", courseId: 1, hoursPerWeek: 4},
      {id: 2, name: "Database Management Systems", courseId: 1, hoursPerWeek: 3},
      {id: 3, name: "Operating Systems", courseId: 1, hoursPerWeek: 3},
      {id: 4, name: "Educational Psychology", courseId: 2, hoursPerWeek: 4},
      {id: 5, name: "Teaching Methodology", courseId: 2, hoursPerWeek: 3},
      {id: 6, name: "Curriculum Development", courseId: 2, hoursPerWeek: 3},
      {id: 7, name: "Principles of Management", courseId: 3, hoursPerWeek: 4},
      {id: 8, name: "Marketing Fundamentals", courseId: 3, hoursPerWeek: 3},
      {id: 9, name: "Financial Accounting", courseId: 3, hoursPerWeek: 3},
      {id: 10, name: "British Literature", courseId: 4, hoursPerWeek: 4},
      {id: 11, name: "Literary Criticism", courseId: 4, hoursPerWeek: 3},
      {id: 12, name: "Creative Writing", courseId: 4, hoursPerWeek: 3},
      {id: 13, name: "Calculus I", courseId: 5, hoursPerWeek: 4},
      {id: 14, name: "Linear Algebra", courseId: 5, hoursPerWeek: 3},
      {id: 15, name: "Statistics", courseId: 5, hoursPerWeek: 3}
    ];
    
    for (const subject of subjectsData) {
      await prisma.subject.create({
        data: subject
      });
    }
    
    logger.info(`Created ${subjectsData.length} subjects`);
    
    // Insert teachers
    const teachersData = [
      {id: 1, name: "Dr. Meena Sharma", maxHoursPerWeek: 12},
      {id: 2, name: "Prof. Rakesh Singh", maxHoursPerWeek: 10},
      {id: 3, name: "Ms. Priya Nair", maxHoursPerWeek: 10},
      {id: 4, name: "Dr. Anil Kumar", maxHoursPerWeek: 12},
      {id: 5, name: "Mrs. Sushma Patil", maxHoursPerWeek: 10},
      {id: 6, name: "Mr. Arjun Verma", maxHoursPerWeek: 8}
    ];
    
    for (const teacher of teachersData) {
      await prisma.teacher.create({
        data: teacher
      });
    }
    
    logger.info(`Created ${teachersData.length} teachers`);
    
    // Insert classrooms
    const classroomsData = [
      {id: 1, name: "A101", capacity: 60, features: "Projector"},
      {id: 2, name: "A102", capacity: 100, features: "Lab"},
      {id: 3, name: "B201", capacity: 80, features: "Smart Board"},
      {id: 4, name: "B202", capacity: 90, features: "Standard Room"},
      {id: 5, name: "C301", capacity: 120, features: "Large Hall"}
    ];
    
    for (const classroom of classroomsData) {
      await prisma.classroom.create({
        data: classroom
      });
    }
    
    logger.info(`Created ${classroomsData.length} classrooms`);
    
    // Insert teacher-subject relationships
    const teacherSubjectsData = [
      {teacherId: 1, subjectId: 1},
      {teacherId: 1, subjectId: 2},
      {teacherId: 2, subjectId: 3},
      {teacherId: 3, subjectId: 4},
      {teacherId: 3, subjectId: 5},
      {teacherId: 4, subjectId: 6},
      {teacherId: 4, subjectId: 7},
      {teacherId: 5, subjectId: 8},
      {teacherId: 5, subjectId: 9},
      {teacherId: 6, subjectId: 10},
      {teacherId: 6, subjectId: 11},
      {teacherId: 6, subjectId: 12},
      {teacherId: 1, subjectId: 13},
      {teacherId: 2, subjectId: 14},
      {teacherId: 3, subjectId: 15}
    ];
    
    for (const ts of teacherSubjectsData) {
      await prisma.teacherSubject.create({
        data: ts
      });
    }
    
    logger.info(`Created ${teacherSubjectsData.length} teacher-subject relationships`);
    
    logger.info('Custom data population completed successfully!');
    console.log('Custom data population completed successfully!');
    
  } catch (error) {
    logger.error('Error populating custom data:', error);
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  populateCustomData()
    .then(() => {
      console.log('Custom data population script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export default populateCustomData;