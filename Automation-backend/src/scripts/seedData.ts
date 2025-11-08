import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function seedData() {
  try {
    // Create sample courses
    const course1 = await prisma.course.create({
      data: {
        name: 'Computer Science',
        totalStudents: 60,
        semester: 1
      }
    });

    const course2 = await prisma.course.create({
      data: {
        name: 'Electrical Engineering',
        totalStudents: 45,
        semester: 1
      }
    });

    logger.info('Created courses');

    // Create sample subjects
    const subject1 = await prisma.subject.create({
      data: {
        name: 'Mathematics',
        hoursPerWeek: 5,
        courseId: course1.id
      }
    });

    const subject2 = await prisma.subject.create({
      data: {
        name: 'Programming Fundamentals',
        hoursPerWeek: 6,
        courseId: course1.id
      }
    });

    const subject3 = await prisma.subject.create({
      data: {
        name: 'Circuit Theory',
        hoursPerWeek: 4,
        courseId: course2.id
      }
    });

    logger.info('Created subjects');

    // Create sample teachers
    const teacher1 = await prisma.teacher.create({
      data: {
        name: 'Dr. Smith',
        maxHoursPerWeek: 20
      }
    });

    const teacher2 = await prisma.teacher.create({
      data: {
        name: 'Prof. Johnson',
        maxHoursPerWeek: 18
      }
    });

    logger.info('Created teachers');

    // Create teacher-subject relationships
    await prisma.teacherSubject.create({
      data: {
        teacherId: teacher1.id,
        subjectId: subject1.id
      }
    });

    await prisma.teacherSubject.create({
      data: {
        teacherId: teacher1.id,
        subjectId: subject2.id
      }
    });

    await prisma.teacherSubject.create({
      data: {
        teacherId: teacher2.id,
        subjectId: subject3.id
      }
    });

    logger.info('Created teacher-subject relationships');

    // Create sample classrooms
    const classroom1 = await prisma.classroom.create({
      data: {
        name: 'Room 101',
        capacity: 50,
        features: 'Projector, Whiteboard'
      }
    });

    const classroom2 = await prisma.classroom.create({
      data: {
        name: 'Room 102',
        capacity: 40,
        features: 'Smart Board, AC'
      }
    });

    const classroom3 = await prisma.classroom.create({
      data: {
        name: 'Lab 201',
        capacity: 30,
        features: 'Computers, Projector'
      }
    });

    logger.info('Created classrooms');
    logger.info('Sample data seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();