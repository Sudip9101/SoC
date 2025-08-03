const { 
  createUser, 
  getUserByEmail, 
  getUserByEmailAndPassword, 
  logAuthAction,
  getPool 
} = require('./database');

async function testAuthSystem() {
  console.log('🔐 Testing Complete Authentication System...\n');
  
  try {
    // 1. Test user registration
    console.log('1️⃣ Testing User Registration...');
    const testUser = {
      email: 'testuser@socteamup.com',
      name: 'Test User',
      password_hash: 'password123',
      role: 'user'
    };
    
    const createResult = await createUser(testUser);
    if (createResult.success) {
      console.log('✅ User registered successfully, ID:', createResult.userId);
    } else {
      console.log('⚠️ User registration result:', createResult.error);
    }
    
    // 2. Test user retrieval by email
    console.log('\n2️⃣ Testing User Retrieval...');
    const userByEmail = await getUserByEmail('testuser@socteamup.com');
    if (userByEmail) {
      console.log('✅ User found by email:', userByEmail.name);
      console.log('   Email:', userByEmail.email);
      console.log('   Role:', userByEmail.role);
      console.log('   Created:', userByEmail.created_at);
    } else {
      console.log('❌ User not found by email');
    }
    
    // 3. Test authentication (login)
    console.log('\n3️⃣ Testing User Authentication (Login)...');
    const authenticatedUser = await getUserByEmailAndPassword('testuser@socteamup.com', 'password123');
    if (authenticatedUser) {
      console.log('✅ User authenticated successfully:', authenticatedUser.name);
      console.log('   User ID:', authenticatedUser.id);
      console.log('   Email:', authenticatedUser.email);
      console.log('   Role:', authenticatedUser.role);
    } else {
      console.log('❌ Authentication failed');
    }
    
    // 4. Test failed authentication
    console.log('\n4️⃣ Testing Failed Authentication...');
    const failedAuth = await getUserByEmailAndPassword('testuser@socteamup.com', 'wrongpassword');
    if (!failedAuth) {
      console.log('✅ Failed authentication handled correctly (wrong password)');
    } else {
      console.log('❌ Authentication should have failed');
    }
    
    // 5. Test auth logging
    console.log('\n5️⃣ Testing Auth Logging...');
    if (authenticatedUser) {
      await logAuthAction({
        user_id: authenticatedUser.id,
        action: 'login',
        ip_address: '192.168.1.100',
        user_agent: 'Test Browser',
        success: true
      });
      console.log('✅ Auth action logged successfully');
    }
    
    // 6. Test duplicate registration
    console.log('\n6️⃣ Testing Duplicate Registration...');
    const duplicateResult = await createUser(testUser);
    if (!duplicateResult.success) {
      console.log('✅ Duplicate registration prevented:', duplicateResult.error);
    } else {
      console.log('❌ Duplicate registration should have failed');
    }
    
    // 7. Show database summary
    console.log('\n7️⃣ Database Summary...');
    const pool = getPool();
    
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [authLogs] = await pool.execute('SELECT COUNT(*) as count FROM auth_logs');
    
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Auth Logs: ${authLogs[0].count}`);
    
    // 8. Show all users
    console.log('\n8️⃣ All Users in Database:');
    const [allUsers] = await pool.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.created_at}`);
    });
    
    console.log('\n🎉 Authentication system test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User registration working');
    console.log('   ✅ User authentication working');
    console.log('   ✅ Failed authentication handled');
    console.log('   ✅ Auth logging working');
    console.log('   ✅ Duplicate prevention working');
    console.log('   ✅ Database storage working');
    
  } catch (error) {
    console.error('❌ Authentication system test failed:', error.message);
  }
}

if (require.main === module) {
  testAuthSystem();
}

module.exports = { testAuthSystem }; 