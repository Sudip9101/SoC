const bcrypt = require('bcryptjs');

const testPassword = 'Sudip@123';
const storedHash = '$2a$12$eRBhcqcqV0zOfVxO/YgJieT7Y8koaJe.2mQzGA/yW091GnzRNEuy2';

console.log('Testing password verification...');
console.log('Password:', testPassword);
console.log('Stored Hash:', storedHash);

bcrypt.compare(testPassword, storedHash)
  .then(isMatch => {
    console.log('Password match:', isMatch);
    if (isMatch) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect!');
    }
  })
  .catch(error => {
    console.error('Error comparing passwords:', error);
  }); 