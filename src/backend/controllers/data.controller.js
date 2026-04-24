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

// obsoleted
function showDataHistory(req, res) {
    const rowLimit = req.query.rowLimit ? parseInt(req.query.rowLimit) : 10;
    const rows = dataService.getDataHistory(rowLimit);
    res.render('data-history', { data: rows });
}

function exportToFile(req, res) {
    try {
        // const all = req.query.all ? req.query.all : false;
        const rowLimit = req.query.rowLimit ? parseInt(req.query.rowLimit) : 10;
        console.log(req.query.rowLimit);
        console.log('Exporting data with row limit:', rowLimit);
        const rows = rowLimit > 0 ? dataService.getDataHistory(rowLimit) : dataService.getDataHistoryNoLimit();

        // Convert JSON to CSV!
        const parser = new Parser();
        const csv = parser.parse(rows);

        // Set headers for download
        res.header('Content-Type', 'text/csv');
        res.attachment('data-history.csv');

        return res.send(csv);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
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

async function getTelemetryData(req, res) {
    const feedKey = req.query.feedKey;
    const rowLimit = req.query.rowLimit ? parseInt(req.query.rowLimit) : null; // if no limit then fetch all
    if (!feedKey) {
        return res.status(422).json({ success: false, error: "feedKey query parameter is required" });
    }
    try {
        const {data, count} = await dataService.getTelemetryData(feedKey, rowLimit);
        res.status(200).json({
            success: true,
            payload: {data, count},
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Threshold data API
function getThresholdsRaw(req, res) {
    try {
        const thresholds = dataService.getThresholdsRaw();
        res.status(200).json({
            success: true,
            payload: thresholds,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
function showThresholdsPage(req, res) {
    const thresholds = dataService.getThresholdsRaw();
    const success = req.query.success === 'true'; // Lấy thông tin thành công từ query parameter
    res.render('thresholds', { thresholds: thresholds, success: success });
}
function addThreshold(req, res) {
    const { parameter, lower_threshold, upper_threshold, severity, station } = req.body;
    try {
        dataService.addThreshold(parameter, lower_threshold, upper_threshold, severity, station);
        res.redirect('/data/thresholds?success=true'); // Redirect về trang hiển thị thresholds sau khi chỉnh sửa thành công
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// obsoleted
function showEditThresholdPage(req, res) {
    const thresholdId = req.params.id;
    const threshold = dataService.getThresholdById(thresholdId); // Giả sử bạn có hàm này trong service để lấy thông tin threshold theo ID
    if (!threshold) {
        return res.status(404).send("Threshold not found");
    }
    console.log(threshold);
    res.render('edit-threshold', { threshold: threshold });
}
function editThreshold(req, res) {
    const thresholdId = req.params.id;
    const { station_id, parameter, lower_threshold, upper_threshold, severity } = req.body;
    try {
        dataService.editThreshold(thresholdId, station_id, parameter, lower_threshold, upper_threshold, severity);
        res.redirect('/data/thresholds?success=true'); // Redirect về trang hiển thị thresholds sau khi chỉnh sửa thành công
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
function deleteThreshold(req, res) {
    const thresholdId = req.params.id;
    try {
        dataService.deleteThreshold(thresholdId);
        res.redirect('/data/thresholds?success=true'); // Redirect về trang hiển thị thresholds sau khi chỉnh sửa thành công
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}


module.exports = {
    getDataHistory,
    showDataHistory,
    getDataHistoryNoLimit,
    exportToFile,
    receiveIoTData,
    getTelemetryData,
    getThresholdsRaw,
    showThresholdsPage,
    addThreshold,
    showEditThresholdPage,
    editThreshold,
    deleteThreshold
};
