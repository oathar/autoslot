import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('demouser@123', 10);
    
    // Create a sample user
    const user = await prisma.teacher.create({
      data: {
        username: 'demouser1',
        email: 'demouser1@gmail.com',
        password: hashedPassword,
        programs: 'B_Ed',
        semester: 'FIRST',
        role: 'TEACHER',
      },
    });
    
    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUser();