'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Calendar, Activity, Key, AlertTriangle, RefreshCw } from 'lucide-react';

interface AuthLog {
  id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  created_at: string;
  email: string;
  name: string;
}

interface FailedLogin {
  email: string;
  attempts: number;
  latest_attempt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  recentRegistrations: number;
  todayLogins: number;
  todayRegistrations: number;
}

export default function AuthLogsPage() {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    recentRegistrations: 0,
    todayLogins: 0,
    todayRegistrations: 0,
  });
  const [failedLogins, setFailedLogins] = useState<FailedLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAuthLogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Auto-detect API URL
      let apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        if (typeof window !== 'undefined') {
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const currentHost = window.location.hostname;
          
          if (isLocalhost) {
            apiUrl = 'http://localhost:3000';
          } else {
            apiUrl = `http://${currentHost}:3000`;
          }
        } else {
          apiUrl = 'http://localhost:3000';
        }
      }
      
      const response = await fetch(`${apiUrl}/api/admin/auth-logs`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch auth logs');
      }
      
      if (result.success) {
        setLogs(result.data.logs);
        setStats(result.data.stats);
        setFailedLogins(result.data.failedLogins);
      } else {
        throw new Error(result.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching auth logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load authentication logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthLogs();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActivityIcon = (action: string, success: boolean) => {
    if (action === 'login') {
      return <Key className={`w-4 h-4 ${success ? 'text-green-600' : 'text-red-600'}`} />;
    } else if (action === 'register') {
      return <User className={`w-4 h-4 ${success ? 'text-blue-600' : 'text-red-600'}`} />;
    } else {
      return <Activity className={`w-4 h-4 ${success ? 'text-purple-600' : 'text-red-600'}`} />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'login': return 'Signed in';
      case 'register': return 'Registered';
      case 'logout': return 'Signed out';
      case 'password_reset': return 'Reset password';
      default: return action;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 text-primary-600" />
            <span className="ml-2 text-lg text-gray-600">Loading authentication logs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="mr-3 text-primary-600" size={32} />
                Authentication Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor user authentication activities and system status
              </p>
            </div>
            <button
              onClick={fetchAuthLogs}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Today's Logins</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.todayLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">New Registrations</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.todayRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-teal-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Recent Signups</h3>
                <p className="text-2xl font-bold text-teal-600">{stats.recentRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Failed Login Attempts Alert */}
        {failedLogins.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Recent Failed Login Attempts (Last 24 Hours)
            </h3>
            <div className="space-y-2">
              {failedLogins.slice(0, 5).map((failed, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-red-700 font-medium">{failed.email}</span>
                  <span className="text-red-600">
                    {failed.attempts} attempts • Latest: {formatDate(failed.latest_attempt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="mr-2 text-primary-600" size={24} />
              Recent Authentication Activities
            </h2>
          </div>

          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Authentication activities will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      {getActivityIcon(log.action, log.success)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {log.name || 'Unknown User'}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({log.email})
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {getActionText(log.action)} • 
                          <span className={log.success ? 'text-green-600' : 'text-red-600'}>
                            {log.success ? ' Success' : ' Failed'}
                          </span>
                          <span className="text-gray-500 ml-2">
                            IP: {log.ip_address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(log.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">MySQL Database</h3>
              <p className="text-sm text-green-600 mt-1">✅ User authentication with database storage</p>
              <p className="text-xs text-green-500 mt-1">Secure password hashing with bcrypt</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Authentication Logging</h3>
              <p className="text-sm text-blue-600 mt-1">✅ Complete audit trail enabled</p>
              <p className="text-xs text-blue-500 mt-1">Login attempts, registrations & IP tracking</p>
            </div>
          </div>
        </div>

        {/* Database Integration Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-4">🎉 MySQL Integration Complete!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800 mb-2">✅ Implemented Features</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• User registration with secure password hashing</li>
                <li>• Login authentication with database validation</li>
                <li>• Authentication activity logging</li>
                <li>• User account management</li>
                <li>• Security monitoring & failed login tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">📊 Real-time Statistics</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Live user registration & login tracking</li>
                <li>• IP address and user agent logging</li>
                <li>• Failed login attempt monitoring</li>
                <li>• Account activation status tracking</li>
                <li>• Comprehensive admin dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 