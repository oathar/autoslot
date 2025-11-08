// entities/user.entity.ts
// Import types from generated Prisma client
import { Program, Semester, Role } from "../generated/prisma";

// Re-export Prisma types
export { Program, Semester, Role };

// You can also keep your original interface for compatibility if needed
export interface IUser {
  id?: number;               
  username: string;
  email: string;
  password: string;     
  programs: Program;
  semester: Semester;
  role: Role;
  created_at?: Date;          
}
