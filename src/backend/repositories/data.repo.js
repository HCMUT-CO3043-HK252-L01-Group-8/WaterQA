const db = require('../database/db');

class DataRepository {
    getDataHistory(row_num) {
        return db.prepare('SELECT * FROM OBSERVATION ORDER BY observation_id DESC LIMIT ?').all([row_num]);
    }
    getDataHistoryNoLimit() {
        return db.prepare('SELECT * FROM OBSERVATION ORDER BY observation_id DESC').all();
    }
    /**
 * Hàm lấy danh sách các trạm mất kết nối (Offline)
 * @param {number} minutesLimit - Số phút tối đa cho phép không có dữ liệu
 */
    getOfflineDevices(minutesLimit) {
        // Lấy tên trạm và thời gian gửi data cuối cùng (MAX(timestamp)).
        // Lọc ra các trạm mà: (Thời gian hiện tại - Thời gian cuối cùng) > minutesLimit
        const sql = `
            SELECT 
                s.station_name as name, 
                MAX(o.timestamp) as lastActive
            FROM IOT_STATION s
            LEFT JOIN OBSERVATION o ON s.station_id = o.station_id
            GROUP BY s.station_id
            HAVING (julianday('now') - julianday(MAX(o.timestamp))) * 24 * 60 > ?
            OR MAX(o.timestamp) IS NULL
        `;

        return db.prepare(sql).all([minutesLimit]);
    };
    getThresholdsRaw() {
        return db.prepare('SELECT * FROM ALERT_THRESHOLD ORDER BY threshold_id ASC').all();
    }
    getThresholdById(id){
        return db.prepare('SELECT * FROM ALERT_THRESHOLD WHERE threshold_id = ?').get([id]);
    }
    // To be developed: add update and delete threshold functions
    addThreshold(threshold_id, station_id, parameter_name, lower_threshold, upper_threshold, severity_level, timestamp, user_id) {
        db
        .prepare('INSERT INTO ALERT_THRESHOLD (threshold_id, station_id, parameter_name, lower_threshold, upper_threshold, severity_level, updated_at, set_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run([threshold_id, station_id, parameter_name, lower_threshold, upper_threshold, severity_level, timestamp, user_id]); // Giả sử user_id = 3 là admin hoặc người dùng đã đăng nhập thực hiện thao tác này
    }
    countRows() {
        return db.prepare("SELECT COUNT(*) AS total FROM ALERT_THRESHOLD").get();
    }
    editThreshold(thresholdId, station_id, parameter_name, lower_threshold, upper_threshold, severity_level, timestamp, user_id) {
        db.prepare('UPDATE ALERT_THRESHOLD SET station_id = ?, parameter_name = ?, lower_threshold = ?, upper_threshold = ?, severity_level = ?, updated_at = ?, set_by_user_id = ? WHERE threshold_id = ?')
        .run([station_id, parameter_name, lower_threshold, upper_threshold, severity_level, timestamp, user_id, thresholdId]);
    }
    deleteThreshold(thresholdId) {
        db.prepare('DELETE FROM ALERT_THRESHOLD WHERE threshold_id = ?')
        .run([thresholdId]);
    }
}


module.exports = new DataRepository();