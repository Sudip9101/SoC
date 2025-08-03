const fetch = require('node-fetch');

async function testFrontendIntegration() {
  console.log('🌐 Testing frontend-backend integration...\n');
  
  try {
    // Test 1: Check if frontend is accessible
    console.log('1️⃣ Testing frontend accessibility...');
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('✅ Frontend is accessible');
    } else {
      console.log('❌ Frontend is not accessible');
      return;
    }
    
    // Test 2: Check if backend API is accessible
    console.log('\n2️⃣ Testing backend API accessibility...');
    const backendResponse = await fetch('http://localhost:3001');
    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log('✅ Backend API is accessible');
      console.log(`   API Info: ${backendData.message} v${backendData.version}`);
    } else {
      console.log('❌ Backend API is not accessible');
      return;
    }
    
    // Test 3: Test contact form submission via API
    console.log('\n3️⃣ Testing contact form submission...');
    const contactData = {
      name: 'Frontend Integration Test',
      email: 'frontend@test.com',
      subject: 'Frontend-Backend Integration Test',
      message: 'This is a test to verify that the frontend can successfully submit contact forms to the backend API and store data in the database.'
    };
    
    const contactResponse = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    if (contactResponse.ok) {
      const result = await contactResponse.json();
      console.log('✅ Contact form submission successful');
      console.log(`   Response: ${JSON.stringify(result)}`);
    } else {
      const errorData = await contactResponse.json();
      console.log('❌ Contact form submission failed');
      console.log(`   Error: ${JSON.stringify(errorData)}`);
    }
    
    // Test 4: Verify data was stored in database
    console.log('\n4️⃣ Verifying database storage...');
    const { getPool } = require('./database');
    const pool = getPool();
    
    const [latestContact] = await pool.execute(
      'SELECT * FROM contact_submissions WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [contactData.email]
    );
    
    if (latestContact.length > 0) {
      console.log('✅ Contact form data stored in database');
      console.log(`   Name: ${latestContact[0].name}`);
      console.log(`   Email: ${latestContact[0].email}`);
      console.log(`   Subject: ${latestContact[0].subject}`);
      console.log(`   Status: ${latestContact[0].status}`);
    } else {
      console.log('❌ Contact form data not found in database');
    }
    
    console.log('\n🎉 Frontend-backend integration test completed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

if (require.main === module) {
  testFrontendIntegration();
}

module.exports = { testFrontendIntegration }; 