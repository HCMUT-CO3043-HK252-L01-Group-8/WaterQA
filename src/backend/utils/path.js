// src/backend/utils/paths.js
const path = require('path');

// Root of your backend folder (where app.js lives)
// const BACKEND_ROOT = __dirname;                     // points to src/backend/

// Or if you prefer one level up (src/):
const BACKEND_ROOT = path.join(__dirname, '..');
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..');

const viewsPath = path.join(BACKEND_ROOT, 'views');
const dataPath  = path.join(BACKEND_ROOT, 'data');
const dbPath    = path.join(dataPath, 'WaterQA.db');

// // Test
// console.log(PROJECT_ROOT);
// console.log(BACKEND_ROOT);

module.exports = {
  BACKEND_ROOT,
  viewsPath,
  dbPath,

  // Helper for views – most convenient
  view: (filename) => path.join(viewsPath, filename),

  // If you later need public, uploads, etc.
  // public: (filename) => path.join(BACKEND_ROOT, 'public', filename),
};