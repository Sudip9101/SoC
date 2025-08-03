const { getPool } = require('./database');

async function viewDatabaseData() {
  console.log('📊 Viewing database data...\n');
  
  try {
    const pool = getPool();
    
    // View users
    console.log('👥 USERS TABLE:');
    const [users] = await pool.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.created_at}`);
      });
    } else {
      console.log('   No users found');
    }
    
    console.log('\n📝 CONTACT SUBMISSIONS:');
    const [contacts] = await pool.execute('SELECT id, name, email, subject, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 10');
    if (contacts.length > 0) {
      contacts.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`      Subject: ${contact.subject}`);
        console.log(`      Status: ${contact.status} | Created: ${contact.created_at}`);
        console.log('');
      });
    } else {
      console.log('   No contact submissions found');
    }
    
    console.log('🔐 AUTH LOGS:');
    const [authLogs] = await pool.execute('SELECT id, user_id, action, ip_address, success, created_at FROM auth_logs ORDER BY created_at DESC LIMIT 5');
    if (authLogs.length > 0) {
      authLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. Action: ${log.action} | User ID: ${log.user_id || 'N/A'} | Success: ${log.success} | ${log.created_at}`);
      });
    } else {
      console.log('   No auth logs found');
    }
    
    console.log('\n📈 SUMMARY:');
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [contactCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    const [authCount] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
    
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Contact Submissions: ${contactCount[0].count}`);
    console.log(`   Auth Logs: ${authCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error viewing data:', error.message);
  }
}

if (require.main === module) {
  viewDatabaseData();
}

module.exports = { viewDatabaseData }; 