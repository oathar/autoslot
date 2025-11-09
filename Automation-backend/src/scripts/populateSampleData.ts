import prisma from '../utils/prismaClient';
import logger from '../utils/logger';

async function populateSampleData() {
  try {
    // Clear existing data
    await prisma.timetable.deleteMany({});
    await prisma.teacherSubject.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.classroom.deleteMany({});
    
    logger.info('Cleared existing data');

    // Create sample courses
    const course1 = await prisma.course.create({
      data: { name: 'Computer Science', totalStudents: 60, semester: 1 }
    });
    const course2 = await prisma.course.create({
      data: { name: 'Electrical Engineering', totalStudents: 45, semester: 1 }
    });
    const course3 = await prisma.course.create({
      data: { name: 'Mechanical Engineering', totalStudents: 50, semester: 2 }
    });
    const course4 = await prisma.course.create({
      data: { name: 'Mathematics', totalStudents: 30, semester: 1 }
    });

    logger.info('Created 4 courses');

    // Create sample subjects
    const subjectsData = [
      { name: 'Data Structures', hoursPerWeek: 4, courseId: course1.id },
      { name: 'Algorithms', hoursPerWeek: 3, courseId: course1.id },
      { name: 'Database Systems', hoursPerWeek: 3, courseId: course1.id },
      { name: 'Circuit Analysis', hoursPerWeek: 4, courseId: course2.id },
      { name: 'Digital Electronics', hoursPerWeek: 3, courseId: course2.id },
      { name: 'Thermodynamics', hoursPerWeek: 4, courseId: course3.id },
      { name: 'Calculus I', hoursPerWeek: 4, courseId: course4.id },
      { name: 'Linear Algebra', hoursPerWeek: 3, courseId: course4.id },
    ];

    const createdSubjects = [];
    for (const subjectData of subjectsData) {
      const subject = await prisma.subject.create({
        data: subjectData
      });
      createdSubjects.push(subject);
    }

    logger.info(`Created ${createdSubjects.length} subjects`);

    // Create sample teachers
    const teachers = await prisma.teacher.createMany({
      data: [
        { name: 'Dr. Smith', maxHoursPerWeek: 20 },
        { name: 'Prof. Johnson', maxHoursPerWeek: 18 },
        { name: 'Dr. Williams', maxHoursPerWeek: 22 },
        { name: 'Prof. Brown', maxHoursPerWeek: 16 },
        { name: 'Dr. Davis', maxHoursPerWeek: 20 },
      ],
      skipDuplicates: true,
    });

    logger.info(`Created ${teachers.count} teachers`);

    // Create sample classrooms
    const classrooms = await prisma.classroom.createMany({
      data: [
        { name: 'Room 101', capacity: 60, features: 'Projector, Whiteboard' },
        { name: 'Room 102', capacity: 45, features: 'Smart Board, AC' },
        { name: 'Room 103', capacity: 50, features: 'Projector, AC' },
        { name: 'Lab 201', capacity: 30, features: 'Computers, Projector' },
        { name: 'Lab 202', capacity: 25, features: 'Electronics Equipment' },
        { name: 'Room 104', capacity: 40, features: 'Whiteboard' },
      ],
      skipDuplicates: true,
    });

    logger.info(`Created ${classrooms.count} classrooms`);

    // Fetch created data for relationships
    const allSubjects = await prisma.subject.findMany();
    const createdTeachers = await prisma.teacher.findMany();

    // Create teacher-subject relationships
    const teacherSubjects = [];
    for (let i = 0; i < createdSubjects.length; i++) {
      teacherSubjects.push({
        teacherId: createdTeachers[i % createdTeachers.length].id,
        subjectId: createdSubjects[i].id,
      });
    }

    const teacherSubjectRelations = await prisma.teacherSubject.createMany({
      data: teacherSubjects,
      skipDuplicates: true,
    });

    logger.info(`Created ${teacherSubjectRelations.count} teacher-subject relationships`);

    // Create sample timetable entries
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
    ];

    const createdCourses = await prisma.course.findMany();
    const createdClassrooms = await prisma.classroom.findMany();

    const timetableEntries = [];
    let entryId = 1;

    for (const day of days) {
      for (const timeSlot of timeSlots) {
        // Skip some time slots to create gaps
        if (Math.random() > 0.7) continue;
        
        timetableEntries.push({
          courseId: createdCourses[(entryId - 1) % createdCourses.length].id,
          subjectId: createdSubjects[(entryId - 1) % createdSubjects.length].id,
          teacherId: createdTeachers[(entryId - 1) % createdTeachers.length].id,
          classroomId: createdClassrooms[(entryId - 1) % createdClassrooms.length].id,
          day: day,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
        });
        
        entryId++;
        if (entryId > 20) break; // Limit to 20 entries
      }
      if (entryId > 20) break;
    }

    const timetable = await prisma.timetable.createMany({
      data: timetableEntries,
      skipDuplicates: true,
    });

    logger.info(`Created ${timetable.count} timetable entries`);

    console.log('\nSample data population completed successfully!');
    console.log('- Courses: 4');
    console.log(`- Subjects: ${createdSubjects.length}`);
    console.log(`- Teachers: ${teachers.count}`);
    console.log(`- Classrooms: ${classrooms.count}`);
    console.log(`- Teacher-Subject Relationships: ${teacherSubjectRelations.count}`);
    console.log(`- Timetable Entries: ${timetable.count}`);

  } catch (error) {
    logger.error('Error populating sample data:', error);
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateSampleData();