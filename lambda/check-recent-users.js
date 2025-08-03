const { getPool } = require('./database');

async function checkRecentUsers() {
  console.log('🔍 Checking Recent User Activity...\n');
  
  try {
    const pool = getPool();
    
    // Check recent users
    console.log('👥 RECENT USERS:');
    const [users] = await pool.execute(`
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Role: ${user.role} | Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`      ID: ${user.id}`);
      console.log('');
    });
    
    // Check recent auth logs
    console.log('🔐 RECENT AUTH ACTIVITY:');
    const [authLogs] = await pool.execute(`
      SELECT al.id, al.user_id, al.action, al.success, al.created_at, u.name, u.email
      FROM auth_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC 
      LIMIT 10
    `);
    
    authLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.action.toUpperCase()} - ${log.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`      User: ${log.name || 'Unknown'} (${log.email || 'Unknown'})`);
      console.log(`      Time: ${new Date(log.created_at).toLocaleString()}`);
      console.log(`      User ID: ${log.user_id}`);
      console.log('');
    });
    
    // Summary
    console.log('📊 SUMMARY:');
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [authCount] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
    const [contactCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    
    console.log(`   Total Users: ${userCount[0].count}`);
    console.log(`   Total Auth Logs: ${authCount[0].count}`);
    console.log(`   Total Contact Submissions: ${contactCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking recent users:', error.message);
  }
}

if (require.main === module) {
  checkRecentUsers();
}

module.exports = { checkRecentUsers }; 