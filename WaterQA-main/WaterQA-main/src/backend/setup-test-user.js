// Temporary script to create a test user
const db = require('./database/db');

try {
  const result = db.prepare(`
    INSERT INTO USER (email, password_hash, role, verification_status)
    VALUES (?, ?, ?, ?)
  `).run('myemail@gmail.com', 'password123', 'User', 1);

  console.log('Test user created successfully!');
  console.log('Email: myemail@gmail.com');
  console.log('Password: password123');
  console.log('User ID:', result.lastInsertRowid);
  
} catch (err) {
  if (err.message.includes('UNIQUE constraint failed')) {
    console.log('Test user already exists');
    console.log('Email: myemail@gmail.com');
    console.log('Password: password123');
  } else {
    console.error('❌ Error creating test user:', err.message);
  }
}

process.exit(0);
