import bcrypt from 'bcryptjs';
import { getDatabase } from './database';

export interface User {
  id: number;
  username: string;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const user = await db.get(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
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
    const db = await getDatabase();
    const user = await db.get(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    return user ? {
      id: user.id,
      username: user.username
    } : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function createUser(username: string, password: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    
    // Check if username already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return null; // Username already exists
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    if (result.lastID) {
      return {
        id: result.lastID,
        username: username
      };
    }

    return null;
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
} 