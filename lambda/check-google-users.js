const { getPool } = require('./database');

async function checkGoogleUsers() {
  console.log('🔍 Checking Google OAuth Users in Database...\n');
  
  try {
    const pool = getPool();
    
    // Check all users with google_id
    console.log('👥 GOOGLE OAUTH USERS:');
    const [googleUsers] = await pool.execute(`
      SELECT id, name, email, google_id, avatar_url, role, created_at 
      FROM users 
      WHERE google_id IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    if (googleUsers.length === 0) {
      console.log('❌ No Google OAuth users found in database');
    } else {
      googleUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      Google ID: ${user.google_id}`);
        console.log(`      Avatar: ${user.avatar_url || 'None'}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log(`      User ID: ${user.id}`);
        console.log('');
      });
    }
    
    // Check all users (including non-Google)
    console.log('👥 ALL USERS IN DATABASE:');
    const [allUsers] = await pool.execute(`
      SELECT id, name, email, google_id, password_hash, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    allUsers.forEach((user, index) => {
      const authType = user.google_id ? 'Google OAuth' : 'Email/Password';
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Auth Type: ${authType}`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`      User ID: ${user.id}`);
      console.log('');
    });
    
    // Check recent auth logs for Google OAuth
    console.log('🔐 RECENT GOOGLE OAUTH ACTIVITY:');
    const [googleAuthLogs] = await pool.execute(`
      SELECT al.id, al.user_id, al.action, al.success, al.created_at, u.name, u.email, u.google_id
      FROM auth_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE u.google_id IS NOT NULL OR al.user_agent LIKE '%Google%'
      ORDER BY al.created_at DESC 
      LIMIT 10
    `);
    
    if (googleAuthLogs.length === 0) {
      console.log('❌ No Google OAuth activity found in auth logs');
    } else {
      googleAuthLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.action.toUpperCase()} - ${log.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`      User: ${log.name || 'Unknown'} (${log.email || 'Unknown'})`);
        console.log(`      Google ID: ${log.google_id || 'N/A'}`);
        console.log(`      Time: ${new Date(log.created_at).toLocaleString()}`);
        console.log(`      User ID: ${log.user_id}`);
        console.log('');
      });
    }
    
    // Summary
    console.log('📊 GOOGLE OAUTH SUMMARY:');
    const [googleUserCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE google_id IS NOT NULL');
    const [totalUserCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [totalAuthCount] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
    
    console.log(`   Google OAuth Users: ${googleUserCount[0].count}`);
    console.log(`   Total Users: ${totalUserCount[0].count}`);
    console.log(`   Total Auth Logs: ${totalAuthCount[0].count}`);
    
    if (googleUserCount[0].count === 0) {
      console.log('\n⚠️  WARNING: No Google OAuth users found!');
      console.log('   This means Google OAuth users are not being saved to the database.');
      console.log('   Check the Google OAuth callback route implementation.');
    } else {
      console.log('\n✅ Google OAuth users are being stored correctly!');
    }
    
  } catch (error) {
    console.error('❌ Error checking Google users:', error.message);
  }
}

if (require.main === module) {
  checkGoogleUsers();
}

module.exports = { checkGoogleUsers }; 