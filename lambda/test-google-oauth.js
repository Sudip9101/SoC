const { createUser, getUserByEmail, logAuthAction } = require('./database');

async function testGoogleOAuth() {
  console.log('🔍 Testing Google OAuth User Creation...\n');
  
  try {
    // Simulate the mock Google user from the callback route
    const mockGoogleUser = {
      id: 'google_rd2boiv9j', // This matches the ID from the logs
      email: 'testuser@gmail.com',
      name: 'Test Google User',
      picture: 'https://via.placeholder.com/100',
      verified_email: true
    };
    
    console.log('📝 Mock Google User Data:');
    console.log(`   Name: ${mockGoogleUser.name}`);
    console.log(`   Email: ${mockGoogleUser.email}`);
    console.log(`   Google ID: ${mockGoogleUser.id}`);
    console.log(`   Avatar: ${mockGoogleUser.picture}\n`);
    
    // Check if user already exists
    console.log('1️⃣ Checking if Google user already exists...');
    const existingUser = await getUserByEmail(mockGoogleUser.email);
    if (existingUser) {
      console.log('✅ Existing Google user found:', existingUser.name);
      console.log('   User ID:', existingUser.id);
      console.log('   Google ID:', existingUser.google_id);
      console.log('   Created:', existingUser.created_at);
    } else {
      console.log('❌ Google user not found, creating new user...');
      
      // Create new Google OAuth user
      const createResult = await createUser({
        email: mockGoogleUser.email,
        name: mockGoogleUser.name,
        google_id: mockGoogleUser.id,
        avatar_url: mockGoogleUser.picture
      });
      
      if (createResult.success) {
        console.log('✅ Google OAuth user created successfully!');
        console.log('   User ID:', createResult.userId);
        
        // Log the Google OAuth login
        await logAuthAction({
          user_id: createResult.userId,
          action: 'login',
          ip_address: '127.0.0.1',
          user_agent: 'Google OAuth',
          success: true
        });
        console.log('✅ Google OAuth login logged');
        
        // Verify user was created
        const newUser = await getUserByEmail(mockGoogleUser.email);
        if (newUser) {
          console.log('\n2️⃣ Verification - Google user found in database:');
          console.log('   ID:', newUser.id);
          console.log('   Name:', newUser.name);
          console.log('   Email:', newUser.email);
          console.log('   Google ID:', newUser.google_id);
          console.log('   Avatar:', newUser.avatar_url);
          console.log('   Role:', newUser.role);
          console.log('   Created:', newUser.created_at);
        }
      } else {
        console.log('❌ Failed to create Google OAuth user:', createResult.error);
      }
    }
    
    // Check all Google OAuth users
    console.log('\n3️⃣ All Google OAuth Users in Database:');
    const { getPool } = require('./database');
    const pool = getPool();
    
    const [googleUsers] = await pool.execute(`
      SELECT id, name, email, google_id, avatar_url, role, created_at 
      FROM users 
      WHERE google_id IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    if (googleUsers.length === 0) {
      console.log('❌ No Google OAuth users found');
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
    
    console.log('🎉 Google OAuth test completed!');
    
  } catch (error) {
    console.error('❌ Google OAuth test failed:', error.message);
  }
}

if (require.main === module) {
  testGoogleOAuth();
}

module.exports = { testGoogleOAuth }; 