// create-admin.js
const db = require('./database/db');

try {
  const result = db.prepare(`
    INSERT INTO USER (email, password_hash, role, verification_status)
    VALUES (?, ?, ?, ?)
  `).run('admin@waterqa.com', 'admin123', 'Admin', 1);

  console.log('Admin user created successfully!');
  console.log('Email: admin@waterqa.com');
  console.log('Password: admin123');
  console.log('User ID:', result.lastInsertRowid);
  
} catch (err) {
  if (err.message.includes('UNIQUE constraint failed')) {
    console.log('Admin user already exists');
    console.log('Email: admin@waterqa.com');
    console.log('Password: admin123');
    
    // Optionally update it to Admin if it was a normal User
    db.prepare(`UPDATE USER SET role = 'Admin', password_hash = 'admin123' WHERE email = 'admin@waterqa.com'`).run();
    console.log('Updated existing user to Admin role.');
  } else {
    console.error('❌ Error creating admin user:', err.message);
  }
}

process.exit(0);
