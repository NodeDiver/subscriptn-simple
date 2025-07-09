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