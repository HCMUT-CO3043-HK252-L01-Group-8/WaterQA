const db = require ('../database/db');

class DataRepository {
    getDataHistory(row_num) {
        return db.prepare('SELECT * FROM OBSERVATION ORDER BY observation_id DESC LIMIT ?').all([row_num]);
    }
    getDataHistoryNoLimit(){
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
}


module.exports = new DataRepository();