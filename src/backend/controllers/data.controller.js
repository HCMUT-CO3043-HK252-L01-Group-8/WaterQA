const dataService = require('../services/data.service');

function getDataHistory(req, res) {
    try {
        const row_num = req.query.row ? parseInt(req.query.row) : 10;
        const rows = dataService.getDataHistory(row_num);
        res.status(200).json({
            success: true,
            payload: {
                count: Array.isArray(rows) ? rows.length : 0,
                data: Array.isArray(rows) ? rows : [],
            },
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function getDataHistoryNoLimit(req, res) {
    try {
        const rows = dataService.getDataHistoryNoLimit();
        res.status(200).json({
            success: true,
            payload: {
                count: Array.isArray(rows) ? rows.length : 0,
                data: Array.isArray(rows) ? rows : [],
            },
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function showDataHistory(req, res) {
    const row_num = req.query.row ? parseInt(req.query.row) : 10;
    const rows = dataService.getDataHistory(row_num);
    res.render('data-history', { data: rows });
}

module.exports = { getDataHistory, showDataHistory, getDataHistoryNoLimit };