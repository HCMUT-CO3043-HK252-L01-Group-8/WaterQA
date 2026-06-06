const express = require('express');
const router = express.Router();

const dataCtrl = require('../controllers/data.controller');
/* Controller methods used:
1. getDataHistory: get raw JSON (default limit = 10)
2. showDataHistory: render EJS file showing data from JSON (use the same Service as #1)
3. getDataHistoryNoLimit: get raw JSON without limit (mock data now has 600+ lines!)
4. showDataHistoryNoLimit (to be developed): render EJS... It should render in many pages, 10 lines per page (adjustable)
*/

router.get('/history', dataCtrl.getDataHistoryNoLimit);
// router.get('/history', dataCtrl.showDataHistory);
router.get('/export', dataCtrl.exportToFile);

router.get('/latest', dataCtrl.getLatestObservation);

router.get('/telemetry', dataCtrl.getTelemetryData);

router.get('/thresholds', dataCtrl.getThresholdsRaw);
router.get('/thresholds/view', dataCtrl.showThresholdsPage);
router.post('/thresholds', dataCtrl.addThreshold);
router.get('/thresholds/:id/edit', dataCtrl.showEditThresholdPage);
router.put('/thresholds/:id', dataCtrl.editThreshold);
router.delete('/thresholds/:id', dataCtrl.deleteThreshold);

router.get('/seed', dataCtrl.seedDatabase);
router.get('/station-history', dataCtrl.getStationHistory);

module.exports = router;