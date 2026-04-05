const express = require('express');
const router = express.Router();

const {getDataHistory, showDataHistory, getDataHistoryNoLimit} = require('../controllers/data.controller');
/* Controller methods used:
1. getDataHistory: get raw JSON (default limit = 10)
2. showDataHistory: render EJS file showing data from JSON (use the same Service as #1)
3. getDataHistoryNoLimit: get raw JSON without limit (mock data now has 600+ lines!)
4. showDataHistoryNoLimit (to be developed): render EJS... It should render in many pages, 10 lines per page (adjustable)
*/

router.get('/history-all', getDataHistoryNoLimit);
router.get('/history', showDataHistory);

module.exports = router;