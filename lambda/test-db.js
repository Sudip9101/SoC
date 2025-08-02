const { testConnection, createUser, getUserByEmail } = require('./database');

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed');
      return;
    }
    console.log('✅ Database connected successfully');
    
    // Test user creation
    const testUser = {
      email: 'test@socteamup.com',
      name: 'Test User',
      google_id: 'test_google_id_123'
    };
    
    console.log('Testing user creation...');
    const createResult = await createUser(testUser);
    console.log('User creation result:', createResult);
    
    // Test user retrieval
    console.log('Testing user retrieval...');
    const user = await getUserByEmail('test@socteamup.com');
    console.log('Retrieved user:', user);
    
    console.log('✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase }; 