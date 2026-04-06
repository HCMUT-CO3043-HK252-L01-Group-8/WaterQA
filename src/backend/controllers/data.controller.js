const dataService = require('../services/data.service');
const { Parser } = require('json2csv');

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

function exportToFile(req, res) {
    try {
        // const all = req.query.all ? req.query.all : false;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const rows = limit > 0 ? dataService.getDataHistory(limit) : dataService.getDataHistoryNoLimit();

        // Convert JSON to CSV!
        const parser = new Parser();
        const csv = parser.parse(rows);

        // Set headers for download
        res.header('Content-Type', 'text/csv');
        res.attachment('data-history.csv');

        return res.send(csv);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }

}

module.exports = { getDataHistory, showDataHistory, getDataHistoryNoLimit, exportToFile };