const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  acquireTimeout: 10000,
  timeout: 10000
};

async function checkDatabaseHealth() {
  console.log('🔍 Checking database health...\n');
  
  try {
    // Test connection
    console.log('1️⃣ Testing connection...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful');
    
    // Test basic queries
    console.log('\n2️⃣ Testing basic queries...');
    
    // Check if tables exist
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [dbConfig.database]);
    
    console.log('✅ Available tables:', tables.map(t => t.TABLE_NAME).join(', '));
    
    // Check table counts
    console.log('\n3️⃣ Checking table records...');
    
    for (const table of tables) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table.TABLE_NAME}`);
        console.log(`   📊 ${table.TABLE_NAME}: ${result[0].count} records`);
      } catch (error) {
        console.log(`   ⚠️ ${table.TABLE_NAME}: Error checking count`);
      }
    }
    
    // Test a simple insert/select (if users table exists)
    if (tables.some(t => t.TABLE_NAME === 'users')) {
      console.log('\n4️⃣ Testing user operations...');
      
      // Try to get a user (should not fail)
      const [users] = await connection.execute('SELECT * FROM users LIMIT 1');
      console.log(`   ✅ Users table accessible, found ${users.length} users`);
    }
    
    // Test contact submissions (if table exists)
    if (tables.some(t => t.TABLE_NAME === 'contact_submissions')) {
      console.log('\n5️⃣ Testing contact submissions...');
      
      const [contacts] = await connection.execute('SELECT * FROM contact_submissions LIMIT 1');
      console.log(`   ✅ Contact submissions table accessible, found ${contacts.length} submissions`);
    }
    
    await connection.end();
    
    console.log('\n🎉 Database health check completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Database: ${dbConfig.database}`);
    console.log(`   - Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   - User: ${dbConfig.user}`);
    console.log(`   - Tables: ${tables.length}`);
    
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Make sure Docker containers are running: docker-compose up');
      console.error('   2. Check if MySQL container is started: docker-compose ps');
      console.error('   3. Verify database credentials in docker-compose.yml');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Authentication failed. Check:');
      console.error('   1. Database username and password');
      console.error('   2. User permissions in MySQL');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist. Check:');
      console.error('   1. Database name in configuration');
      console.error('   2. Database initialization script');
    }
  }
}

// Run health check if this file is executed directly
if (require.main === module) {
  checkDatabaseHealth();
}

module.exports = { checkDatabaseHealth }; 