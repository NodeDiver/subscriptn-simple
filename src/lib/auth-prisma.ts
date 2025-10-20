import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export interface User {
  id: number;
  username: string | null;
  role: UserRole;
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true
      }
    });
    return user;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        role: true
      }
    });
    return user;
  } catch (error) {
    console.error('Get user by username error:', error);
    return null;
  }
}

export async function createUser(
  username: string,
  password: string,
  role: UserRole = UserRole.BITCOINER
): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return null; // Username already exists
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role
      },
      select: {
        id: true,
        username: true,
        role: true
      }
    });

    return user;
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
}

export async function verifyUser(username: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  } catch (error) {
    console.error('Verify user error:', error);
    return null;
  }
}

// Alias for backward compatibility with existing API
export const authenticateUser = verifyUser; 