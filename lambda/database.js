const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool = null;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
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

// User management functions
const createUser = async (userData) => {
  const pool = getPool();
  const { email, name, password_hash, google_id, avatar_url } = userData;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (email, name, password_hash, google_id, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [email, name, password_hash || null, google_id || null, avatar_url || null]
    );
    return { success: true, userId: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'User already exists' };
    }
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, updates) => {
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
const logAuthAction = async (logData) => {
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

// Contact form submissions
const saveContactSubmission = async (submissionData) => {
  const pool = getPool();
  const { name, email, subject, message } = submissionData;
  const phone = submissionData.phone || null;
  const company = submissionData.company || null;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, subject, message]
    );
    return { success: true, submissionId: result.insertId };
  } catch (error) {
    console.error('Database error in saveContactSubmission:', error);
    throw error;
  }
};

const getContactSubmissions = async (limit = 50, offset = 0) => {
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

const updateContactSubmissionStatus = async (id, status) => {
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

// Password authentication functions
const authenticateUser = async (email, password_hash) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password_hash = ? AND is_active = TRUE',
      [email, password_hash]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const getUserByEmailAndPassword = async (email, password_hash) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?',
      [email, password_hash]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPool,
  testConnection,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  logAuthAction,
  saveContactSubmission,
  getContactSubmissions,
  updateContactSubmissionStatus,
  authenticateUser,
  getUserByEmailAndPassword
}; 