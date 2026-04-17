const dataService = require('../services/data.service');
const { Parser } = require('json2csv');
const mailService = require('../services/mail.service');

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

// Đây là hàm xử lý API nhận data từ IoT của bạn
const receiveIoTData = async (req, res) => {
    try {
        const { stationName, temperature, humidity } = req.body;

        // Kiểm tra lỗi phần cứng
        // DHT20, nhiệt độ phòng thường 0-50, độ ẩm 0-100
        if (humidity < 0 || humidity > 100 || temperature < -10 || temperature > 80) {
            const errorData = {
                stationName: stationName || 'Trạm IoT (Chưa rõ)',
                wqi: 'LỖI CẢM BIẾN',
                message: `Phát hiện dữ liệu phần cứng bất thường. Nhiệt độ: ${temperature}°C, Độ ẩm: ${humidity}%. Có thể thiết bị đã bị chập, vui lòng kiểm tra ngay!`
            };
            
            // Bắn mail cảnh báo ngay lập tức (nhớ thay email của bạn vào)
            mailService.sendAlertEmail('taikhoanneverdie17@gmail.com', errorData)
                .catch(err => console.error('Lỗi gửi mail cảnh báo phần cứng:', err));
        }
        return res.status(200).json({ message: "Đã nhận và xử lý dữ liệu" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getDataHistory, showDataHistory, getDataHistoryNoLimit, exportToFile, receiveIoTData};