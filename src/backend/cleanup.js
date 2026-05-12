// Cleanup old account for testing
const db = require('./database/db');

try {
  const email = 'luonggminh05@gmail.com';
  
  // First, check if account exists
  const existing = db.prepare('SELECT * FROM USER WHERE email = ?').all([email]);
  console.log('Found accounts:', existing);
  
  if (existing.length > 0) {
    // Delete the account
    const result = db.prepare('DELETE FROM USER WHERE email = ?').run([email]);
    console.log('Deleted rows:', result.changes);
    console.log('✅ Account deleted successfully');
  } else {
    console.log('❌ Account not found');
  }
  
  // Show remaining accounts
  const remaining = db.prepare('SELECT user_id, email, created_at FROM USER').all();
  console.log('Remaining accounts:', remaining);
  
  process.exit(0);
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
