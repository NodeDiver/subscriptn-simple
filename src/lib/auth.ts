import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export interface User {
  id: number;
  username: string;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      username: user.username
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true }
    });

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function createUser(username: string, password: string): Promise<User | null> {
  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return null; // Username already exists
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash
      },
      select: { id: true, username: true }
    });

    return user;
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
} 