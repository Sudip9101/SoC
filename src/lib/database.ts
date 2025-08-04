import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool: mysql.Pool | null = null;

const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getPool().getConnection();
    console.log('Database connected successfully');
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
  const pool = getPool();
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
  const pool = getPool();
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
  const pool = getPool();
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
  const pool = getPool();
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
  const pool = getPool();
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
  const pool = getPool();
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
  const pool = getPool();
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

// Authentication logging
export const logAuthAction = async (logData: {
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
}) => {
  const pool = getPool();
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

// Password authentication functions
export const authenticateUser = async (email: string, password_hash: string) => {
  const pool = getPool();
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
  const pool = getPool();
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