// Server-only database functions
// This module should only be used in API routes (server-side)

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',  // Use 'mysql' for Docker environment
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool dynamically
let pool: any = null;

const getPool = async (): Promise<any> => {
  if (!pool) {
    const mysql = await import('mysql2/promise');
    pool = mysql.default.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await (await getPool()).getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Contact form submissions
export const saveContactSubmission = async (submissionData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}) => {
  const pool = await getPool();
  const { name, email, subject, message } = submissionData;
  const phone = submissionData.phone || null;
  const company = submissionData.company || null;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, subject, message]
    );
    return { success: true, submissionId: (result as any).insertId };
  } catch (error) {
    console.error('Database error in saveContactSubmission:', error);
    throw error;
  }
};

export const getContactSubmissions = async (limit = 50, offset = 0) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateContactSubmissionStatus = async (id: number, status: string) => {
  const pool = await getPool();
  try {
    await pool.execute(
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, id]
    );
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// User management functions
export const createUser = async (userData: {
  email: string;
  name: string;
  password_hash?: string;
  google_id?: string;
  avatar_url?: string;
}) => {
  const pool = await getPool();
  const { email, name, password_hash, google_id, avatar_url } = userData;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (email, name, password_hash, google_id, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [email, name, password_hash || null, google_id || null, avatar_url || null]
    );
    return { success: true, userId: (result as any).insertId };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'User already exists' };
    }
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return (rows as any[])[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return (rows as any[])[0] || null;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: number, updates: Record<string, any>) => {
  const pool = await getPool();
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  try {
    await pool.execute(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Update user's last login time
export const updateLastLogin = async (userId: number) => {
  const pool = await getPool();
  try {
    await pool.execute(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to update last login:', error);
    return { success: false };
  }
};

// Get user statistics
export const getUserStats = async () => {
  const pool = await getPool();
  try {
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [activeUsers] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
    const [recentRegistrations] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    
    return {
      total: (totalUsers as any[])[0].count,
      active: (activeUsers as any[])[0].count,
      recentRegistrations: (recentRegistrations as any[])[0].count
    };
  } catch (error) {
    throw error;
  }
};

// Authentication logging
export const logAuthAction = async (logData: {
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
}) => {
  const pool = await getPool();
  const { user_id, action, ip_address, user_agent, success } = logData;
  
  try {
    await pool.execute(
      'INSERT INTO auth_logs (user_id, action, ip_address, user_agent, success) VALUES (?, ?, ?, ?, ?)',
      [user_id, action, ip_address, user_agent, success]
    );
  } catch (error) {
    console.error('Failed to log auth action:', error);
  }
};

// Get authentication logs
export const getAuthLogs = async (limit = 50, offset = 0, userId?: number) => {
  const pool = await getPool();
  try {
    let query = `
      SELECT al.*, u.email, u.name 
      FROM auth_logs al 
      LEFT JOIN users u ON al.user_id = u.id
    `;
    let params: any[] = [];
    
    if (userId) {
      query += ' WHERE al.user_id = ?';
      params.push(userId);
    }
    
    query += ` ORDER BY al.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Get recent failed login attempts for security monitoring
export const getRecentFailedLogins = async (hours = 24) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      `SELECT u.email, COUNT(*) as attempts, MAX(al.created_at) as latest_attempt
       FROM auth_logs al
       JOIN users u ON al.user_id = u.id
       WHERE al.action = 'login' 
         AND al.success = FALSE 
         AND al.created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
       GROUP BY u.email
       ORDER BY attempts DESC`,
      [hours]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Deactivate user account
export const deactivateUser = async (userId: number) => {
  const pool = await getPool();
  try {
    await pool.execute(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [userId]
    );
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Activate user account
export const activateUser = async (userId: number) => {
  const pool = await getPool();
  try {
    await pool.execute(
      'UPDATE users SET is_active = TRUE WHERE id = ?',
      [userId]
    );
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Check if email exists (useful for registration validation)
export const emailExists = async (email: string): Promise<boolean> => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return (rows as any[]).length > 0;
  } catch (error) {
    throw error;
  }
};

// Password authentication functions (legacy - keeping for compatibility)
export const authenticateUser = async (email: string, password_hash: string) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password_hash = ? AND is_active = TRUE',
      [email, password_hash]
    );
    return (rows as any[])[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmailAndPassword = async (email: string, password_hash: string) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?',
      [email, password_hash]
    );
    return (rows as any[])[0] || null;
  } catch (error) {
    throw error;
  }
}; 