const fs = require('fs');
const path = require('path');
const db = require('./db');

// Read SQL
//This path assumes the SQL file is located at: /data/Water_QA_Original.sql
const sqlPath = path.join(__dirname, '../../data/Water_QA_Original.sql'); // NOTE: Update this path if your project structure is different. 
const sql = fs.readFileSync(sqlPath, 'utf8');

//Run schema
db.exec(sql);

console.log('Database initialized from SQL file');
