const { testConnection, saveContactSubmission, getContactSubmissions } = require('./database');

async function simpleTest() {
  console.log('🧪 Running simple database test...\n');
  
  try {
    // 1. Test connection
    console.log('1️⃣ Testing connection...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Connection failed');
      return;
    }
    console.log('✅ Connection successful\n');
    
    // 2. Test contact form submission
    console.log('2️⃣ Testing contact form...');
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Database Test',
      message: 'This is a test message to verify database functionality.'
    };
    
    const result = await saveContactSubmission(contactData);
    if (result.success) {
      console.log('✅ Contact submission saved, ID:', result.submissionId);
    } else {
      console.log('❌ Failed to save contact submission');
    }
    
    // 3. Test retrieving submissions
    console.log('\n3️⃣ Testing retrieval...');
    const submissions = await getContactSubmissions(5, 0);
    console.log(`✅ Retrieved ${submissions.length} submissions`);
    
    if (submissions.length > 0) {
      console.log('📝 Latest submission:');
      console.log(`   Name: ${submissions[0].name}`);
      console.log(`   Email: ${submissions[0].email}`);
      console.log(`   Subject: ${submissions[0].subject}`);
      console.log(`   Created: ${submissions[0].created_at}`);
    }
    
    console.log('\n🎉 Simple database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  simpleTest();
}

 