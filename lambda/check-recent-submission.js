const { getPool } = require('./database');

async function checkRecentSubmission() {
  console.log('🔍 Checking for recent contact form submission...\n');
  
  try {
    const pool = getPool();
    
    // Check for the specific submission
    console.log('📝 Looking for your recent submission...');
    const [recentSubmissions] = await pool.execute(`
      SELECT * FROM contact_submissions 
      WHERE email = 'sudip.das1392001@gmail.com' 
      OR name LIKE '%Sudip%'
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    if (recentSubmissions.length > 0) {
      console.log('✅ Found your submission(s):');
      recentSubmissions.forEach((submission, index) => {
        console.log(`\n   Submission ${index + 1}:`);
        console.log(`   Name: ${submission.name}`);
        console.log(`   Email: ${submission.email}`);
        console.log(`   Subject: ${submission.subject}`);
        console.log(`   Message: ${submission.message}`);
        console.log(`   Status: ${submission.status}`);
        console.log(`   Created: ${submission.created_at}`);
      });
    } else {
      console.log('❌ Your submission was not found in the database');
      console.log('   This might indicate an API connection issue');
    }
    
    // Show all recent submissions
    console.log('\n📋 All recent submissions (last 10):');
    const [allRecent] = await pool.execute(`
      SELECT id, name, email, subject, created_at 
      FROM contact_submissions 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    if (allRecent.length > 0) {
      allRecent.forEach((submission, index) => {
        console.log(`   ${index + 1}. ${submission.name} (${submission.email})`);
        console.log(`      Subject: ${submission.subject}`);
        console.log(`      Created: ${submission.created_at}`);
        console.log('');
      });
    }
    
    // Check total count
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    console.log(`📊 Total contact submissions in database: ${totalCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking submission:', error.message);
  }
}

if (require.main === module) {
  checkRecentSubmission();
}

module.exports = { checkRecentSubmission }; 