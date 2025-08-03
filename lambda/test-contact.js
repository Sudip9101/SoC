const { 
  testConnection, 
  createUser, 
  getUserByEmail, 
  getUserById,
  updateUser,
  logAuthAction,
  saveContactSubmission,
  getContactSubmissions,
  updateContactSubmissionStatus
} = require('./database');

async function testDatabaseComprehensive() {
  console.log('🔍 Starting comprehensive database test...\n');
  
  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed');
      return;
    }
    console.log('✅ Database connected successfully\n');
    
    // 2. Test user creation
    console.log('2️⃣ Testing user creation...');
    const testUser = {
      email: 'test@socteamup.com',
      name: 'Test User',
      google_id: 'test_google_id_123',
      avatar_url: 'https://example.com/avatar.jpg'
    };
    
    const createResult = await createUser(testUser);
    if (createResult.success) {
      console.log('✅ User created successfully, ID:', createResult.userId);
    } else {
      console.log('⚠️ User creation result:', createResult.error);
    }
    
    // 3. Test user retrieval by email
    console.log('\n3️⃣ Testing user retrieval by email...');
    const userByEmail = await getUserByEmail('test@socteamup.com');
    if (userByEmail) {
      console.log('✅ User retrieved by email:', userByEmail.name);
    } else {
      console.log('❌ Failed to retrieve user by email');
    }
    
    // 4. Test user retrieval by ID
    console.log('\n4️⃣ Testing user retrieval by ID...');
    if (createResult.success) {
      const userById = await getUserById(createResult.userId);
      if (userById) {
        console.log('✅ User retrieved by ID:', userById.name);
      } else {
        console.log('❌ Failed to retrieve user by ID');
      }
    }
    
    // 5. Test user update
    console.log('\n5️⃣ Testing user update...');
    if (createResult.success) {
      const updateResult = await updateUser(createResult.userId, { 
        name: 'Updated Test User',
        role: 'admin'
      });
      if (updateResult.success) {
        console.log('✅ User updated successfully');
      } else {
        console.log('❌ Failed to update user');
      }
    }
    
    // 6. Test auth logging
    console.log('\n6️⃣ Testing auth logging...');
    await logAuthAction({
      user_id: createResult.success ? createResult.userId : null,
      action: 'login',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Test Browser)',
      success: true
    });
    console.log('✅ Auth action logged successfully');
    
    // 7. Test contact form submission
    console.log('\n7️⃣ Testing contact form submission...');
    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      subject: 'Test Inquiry',
      message: 'This is a test contact form submission.'
    };
    
    const contactResult = await saveContactSubmission(contactData);
    if (contactResult.success) {
      console.log('✅ Contact submission saved, ID:', contactResult.submissionId);
    } else {
      console.log('❌ Failed to save contact submission');
    }
    
    // 8. Test contact submissions retrieval
    console.log('\n8️⃣ Testing contact submissions retrieval...');
    const submissions = await getContactSubmissions(10, 0);
    console.log(`✅ Retrieved ${submissions.length} contact submissions`);
    
    // 9. Test contact submission status update
    console.log('\n9️⃣ Testing contact submission status update...');
    if (contactResult.success) {
      const statusResult = await updateContactSubmissionStatus(contactResult.submissionId, 'in_progress');
      if (statusResult.success) {
        console.log('✅ Contact submission status updated');
      } else {
        console.log('❌ Failed to update contact submission status');
      }
    }
    
    // 10. Test database tables
    console.log('\n🔟 Testing database tables...');
    const pool = require('./database').getPool();
    
    // Check users table
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users table: ${users[0].count} records`);
    
    // Check auth_logs table
    const [authLogs] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
    console.log(`✅ Auth logs table: ${authLogs[0].count} records`);
    
    // Check contact_submissions table
    const [contacts] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    console.log(`✅ Contact submissions table: ${contacts[0].count} records`);
    
    console.log('\n🎉 All database tests completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   - Users: ${users[0].count}`);
    console.log(`   - Auth Logs: ${authLogs[0].count}`);
    console.log(`   - Contact Submissions: ${contacts[0].count}`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseComprehensive();
}

module.exports = { testDatabaseComprehensive };




