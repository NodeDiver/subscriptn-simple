import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  db = await open({
    filename: path.join(process.cwd(), 'subscriptn.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('provider', 'shop_owner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS servers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      host_url TEXT NOT NULL,
      api_key TEXT NOT NULL,
      provider_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (provider_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lightning_address TEXT,
      server_id INTEGER NOT NULL,
      owner_id INTEGER NOT NULL,
      subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'pending')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (server_id) REFERENCES servers (id),
      FOREIGN KEY (owner_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      amount_sats INTEGER NOT NULL,
      interval TEXT NOT NULL CHECK (interval IN ('daily', 'weekly', 'monthly', 'yearly')),
      zap_planner_id TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shop_id) REFERENCES shops (id)
    );

    CREATE TABLE IF NOT EXISTS subscription_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL,
      payment_amount INTEGER NOT NULL,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    );
  `);

  // Initialize with demo users if they don't exist
  // ⚠️ PRODUCTION NOTE: Remove demo users or use environment variables for production
  const demoUsers = [
    { username: process.env.DEMO_PROVIDER_USERNAME || 'btcpayserver', password: process.env.DEMO_PROVIDER_PASSWORD || 'btcpayserver', role: 'provider' },
    { username: process.env.DEMO_SHOP_OWNER_USERNAME || 'shopowner', password: process.env.DEMO_SHOP_OWNER_PASSWORD || 'shopowner', role: 'shop_owner' }
  ];

  // Only create demo users in development
  if (process.env.NODE_ENV !== 'production') {
    for (const user of demoUsers) {
      const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [user.username]);
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await db.run(
          'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
          [user.username, passwordHash, user.role]
        );
      }
    }
  }

  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
} 