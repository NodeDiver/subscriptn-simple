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
    
    -- Add unique constraint on host_url only if it doesn't exist
    CREATE UNIQUE INDEX IF NOT EXISTS idx_servers_host_url ON servers (host_url);

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
    
    -- Add unique constraint on shop name + server combination
    CREATE UNIQUE INDEX IF NOT EXISTS idx_shops_name_server ON shops (name, server_id);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      amount_sats INTEGER NOT NULL,
      interval TEXT NOT NULL CHECK (interval IN ('daily', 'weekly', 'monthly', 'yearly')),
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shop_id) REFERENCES shops (id)
    );
    
    -- Add unique constraint on active subscriptions per shop
    CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_active_shop ON subscriptions (shop_id) WHERE status = 'active';

    CREATE TABLE IF NOT EXISTS subscription_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER NOT NULL,
      payment_amount INTEGER NOT NULL,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
      payment_method TEXT,
      wallet_provider TEXT,
      preimage TEXT,
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    );
    
    -- Add missing columns if they don't exist (migration)
    ALTER TABLE subscription_history ADD COLUMN payment_method TEXT;
    ALTER TABLE subscription_history ADD COLUMN wallet_provider TEXT;
    ALTER TABLE subscription_history ADD COLUMN preimage TEXT;
  `);

  // Initialize with demo users if they don't exist
  // ⚠️ PRODUCTION NOTE: Remove demo users or use environment variables for production
  const demoUsers = [
    { username: process.env.DEMO_USERNAME || 'demo', password: process.env.DEMO_PASSWORD || 'demo' },
    { username: 'demo1', password: 'demo1' },
    { username: 'demo2', password: 'demo2' },
    { username: 'demo3', password: 'demo3' },
    { username: 'demo4', password: 'demo4' }
  ];

  // Only create demo users in development
  if (process.env.NODE_ENV !== 'production') {
    for (const user of demoUsers) {
      const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [user.username]);
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await db.run(
          'INSERT INTO users (username, password_hash) VALUES (?, ?)',
          [user.username, passwordHash]
        );
      }
    }

    // Create demo server if it doesn't exist
    const existingServer = await db.get('SELECT id FROM servers WHERE id = ?', [1]);
    if (!existingServer) {
      // Get the first user to be the provider
      const firstUser = await db.get('SELECT id FROM users LIMIT 1');
      if (firstUser) {
        await db.run(
          'INSERT INTO servers (id, name, host_url, api_key, provider_id) VALUES (?, ?, ?, ?, ?)',
          [1, 'Demo BTCPay Server', 'https://btcpay.aceptabitcoin.com', 'demo-api-key', firstUser.id]
        );
        console.log('Demo server created with ID 1');
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