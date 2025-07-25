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
      description TEXT,
      is_public BOOLEAN DEFAULT 1,
      slots_available INTEGER DEFAULT 21,
      lightning_address TEXT,
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
    
    -- Add new columns to servers table if they don't exist (migration)
    ALTER TABLE servers ADD COLUMN description TEXT;
    ALTER TABLE servers ADD COLUMN is_public BOOLEAN DEFAULT 1;
    ALTER TABLE servers ADD COLUMN slots_available INTEGER DEFAULT 21;
    ALTER TABLE servers ADD COLUMN lightning_address TEXT;
    
    -- Add new columns to shops table if they don't exist (migration)
    ALTER TABLE shops ADD COLUMN is_public BOOLEAN DEFAULT 1;
  `);

  // Initialize with demo users if they don't exist
  // ⚠️ PRODUCTION NOTE: Remove demo users or use environment variables for production
  const demoUsers = [
    { username: process.env.DEMO_USERNAME || 'demo', password: process.env.DEMO_PASSWORD || 'demo' },
    { username: 'demo1', password: 'demo1' },
    { username: 'demo2', password: 'demo2' },
    { username: 'demo3', password: 'demo3' },
    { username: 'demo4', password: 'demo4' },
    { username: 'muni', password: 'muni' }
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

    // Create muni's BTCPay server if it doesn't exist
    const muniUser = await db.get('SELECT id FROM users WHERE username = ?', ['muni']);
    if (muniUser) {
      const existingMuniServer = await db.get('SELECT id FROM servers WHERE name = ? AND provider_id = ?', ['muni btcpayserver', muniUser.id]);
      if (!existingMuniServer) {
        await db.run(
          'INSERT INTO servers (name, host_url, api_key, provider_id) VALUES (?, ?, ?, ?)',
          ['muni btcpayserver', 'https://muni-btcpay.example.com', 'muni-api-key-123', muniUser.id]
        );
        console.log('Muni BTCPay server created');
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

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const database = await getDatabase();
    await database.get('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Database statistics
export async function getDatabaseStats(): Promise<{
  users: number;
  servers: number;
  shops: number;
  subscriptions: number;
  payments: number;
}> {
  try {
    const database = await getDatabase();
    const [users] = await database.get('SELECT COUNT(*) as count FROM users');
    const [servers] = await database.get('SELECT COUNT(*) as count FROM servers');
    const [shops] = await database.get('SELECT COUNT(*) as count FROM shops');
    const [subscriptions] = await database.get('SELECT COUNT(*) as count FROM subscriptions');
    const [payments] = await database.get('SELECT COUNT(*) as count FROM subscription_history');
    
    return {
      users: users.count,
      servers: servers.count,
      shops: shops.count,
      subscriptions: subscriptions.count,
      payments: payments.count
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      users: 0,
      servers: 0,
      shops: 0,
      subscriptions: 0,
      payments: 0
    };
  }
} 