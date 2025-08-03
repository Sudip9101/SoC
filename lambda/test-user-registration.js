const { createUser, getUserByEmail, logAuthAction } = require('./database');

async function testUserRegistration() {
  console.log('👤 Testing User Registration with Form Data...\n');
  
  try {
    // Test with the exact form data from the image
    const userData = {
      email: 'sudip.das1392001@gmail.com',
      name: 'Sudip Das',
      password_hash: 'Sudip',
      role: 'user'
    };
    
    console.log('📝 Registration Data:');
    console.log(`   Name: ${userData.name}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password_hash}`);
    console.log(`   Role: ${userData.role}\n`);
    
    // Check if user already exists
    console.log('1️⃣ Checking if user already exists...');
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.name);
      console.log('   User ID:', existingUser.id);
      console.log('   Created:', existingUser.created_at);
    } else {
      console.log('✅ User does not exist, proceeding with registration...');
    }
    
    // Create new user
    console.log('\n2️⃣ Creating new user...');
    const createResult = await createUser(userData);
    
    if (createResult.success) {
      console.log('✅ User registered successfully!');
      console.log('   User ID:', createResult.userId);
      
      // Log the registration action
      await logAuthAction({
        user_id: createResult.userId,
        action: 'register',
        ip_address: '127.0.0.1',
        user_agent: 'Registration Form',
        success: true
      });
      console.log('✅ Registration action logged');
      
      // Verify user was created
      const newUser = await getUserByEmail(userData.email);
      if (newUser) {
        console.log('\n3️⃣ Verification - User found in database:');
        console.log('   ID:', newUser.id);
        console.log('   Name:', newUser.name);
        console.log('   Email:', newUser.email);
        console.log('   Role:', newUser.role);
        console.log('   Created:', newUser.created_at);
      }
      
    } else {
      console.log('❌ Registration failed:', createResult.error);
    }
    
    console.log('\n🎉 Registration test completed!');
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
  }
}

if (require.main === module) {
  testUserRegistration();
}

module.exports = { testUserRegistration }; 