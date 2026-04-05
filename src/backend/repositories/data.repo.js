const db = require ('../database/db');

class DataRepository {
    getDataHistory(row_num) {
        return db.prepare('SELECT * FROM OBSERVATION ORDER BY timestamp DESC LIMIT ?').all([row_num]);
    }
    getDataHistoryNoLimit(){
        return db.prepare('SELECT * FROM OBSERVATION ORDER BY timestamp DESC').all();
    }
}

module.exports = new DataRepository();