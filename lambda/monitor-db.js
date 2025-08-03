const { getPool } = require('./database');

async function monitorDatabase() {
  console.log('🔍 Starting real-time database monitoring...');
  console.log('Press Ctrl+C to stop monitoring\n');
  
  let lastUserCount = 0;
  let lastSubmissionCount = 0;
  let lastLogCount = 0;
  
  const checkForChanges = async () => {
    try {
      const pool = getPool();
      
      // Get current counts
      const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
      const [submissionCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
      const [logCount] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
      
      const currentUserCount = userCount[0].count;
      const currentSubmissionCount = submissionCount[0].count;
      const currentLogCount = logCount[0].count;
      
      // Check for changes
      if (currentUserCount > lastUserCount) {
        console.log(`🆕 NEW USER ADDED! Total users: ${currentUserCount}`);
        const [newUsers] = await pool.execute('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 1');
        console.log(`   Latest user: ${newUsers[0].email} (${newUsers[0].name})`);
      }
      
      if (currentSubmissionCount > lastSubmissionCount) {
        console.log(`📧 NEW CONTACT SUBMISSION! Total submissions: ${currentSubmissionCount}`);
        const [newSubmissions] = await pool.execute('SELECT id, name, email, subject FROM contact_submissions ORDER BY created_at DESC LIMIT 1');
        console.log(`   Latest submission: ${newSubmissions[0].name} (${newSubmissions[0].email}) - ${newSubmissions[0].subject}`);
      }
      
      if (currentLogCount > lastLogCount) {
        console.log(`🔐 NEW AUTH LOG! Total logs: ${currentLogCount}`);
        const [newLogs] = await pool.execute('SELECT id, user_id, action, success FROM auth_logs ORDER BY created_at DESC LIMIT 1');
        console.log(`   Latest log: User ${newLogs[0].user_id || 'N/A'} - ${newLogs[0].action} (${newLogs[0].success ? 'Success' : 'Failed'})`);
      }
      
      // Update last counts
      lastUserCount = currentUserCount;
      lastSubmissionCount = currentSubmissionCount;
      lastLogCount = currentLogCount;
      
      // Show current status every 30 seconds
      const now = new Date();
      if (now.getSeconds() % 30 === 0) {
        console.log(`\n📊 Current Status [${now.toLocaleTimeString()}]:`);
        console.log(`   Users: ${currentUserCount} | Submissions: ${currentSubmissionCount} | Auth Logs: ${currentLogCount}`);
      }
      
    } catch (error) {
      console.error('❌ Error monitoring database:', error);
    }
  };
  
  // Check every 5 seconds
  setInterval(checkForChanges, 5000);
  
  // Initial check
  await checkForChanges();
}

// Run monitor if this file is executed directly
if (require.main === module) {
  monitorDatabase();
}

module.exports = { monitorDatabase }; 