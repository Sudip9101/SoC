import { NextRequest, NextResponse } from 'next/server';
import { getAuthLogs, getUserStats, getRecentFailedLogins } from '@/lib/database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle GET requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

    // Fetch authentication logs
    const logs = await getAuthLogs(limit, offset, userId);
    
    // Fetch user statistics
    const stats = await getUserStats();
    
    // Fetch recent failed logins for security monitoring
    const failedLogins = await getRecentFailedLogins(24);

    // Calculate today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = (logs as any[]).filter(log => 
      new Date(log.created_at) >= today
    );
    
    const todayLogins = todayLogs.filter(log => 
      log.action === 'login' && log.success
    ).length;
    
    const todayRegistrations = todayLogs.filter(log => 
      log.action === 'register' && log.success
    ).length;

    return NextResponse.json(
      {
        success: true,
        data: {
          logs,
          stats: {
            totalUsers: stats.total,
            activeUsers: stats.active,
            recentRegistrations: stats.recentRegistrations,
            todayLogins,
            todayRegistrations
          },
          failedLogins,
          pagination: {
            limit,
            offset,
            hasMore: (logs as any[]).length === limit
          }
        }
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error fetching auth logs:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch authentication logs' 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
} 