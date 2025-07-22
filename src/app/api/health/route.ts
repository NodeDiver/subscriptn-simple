import { NextResponse } from 'next/server';
import { checkDatabaseHealth, getDatabaseStats } from '@/lib/database';

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth();
    const stats = await getDatabaseStats();
    
    const health = {
      status: dbHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbHealth,
        stats
      },
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(health, {
      status: dbHealth ? 200 : 503
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
} 