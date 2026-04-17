const dataRepo = require('../repositories/data.repo');
const dayjs = require('dayjs');

class DataService {
    getDataHistory(row_num) {
        return dataRepo.getDataHistory(row_num);
    }
    getDataHistoryNoLimit() {
        return dataRepo.getDataHistoryNoLimit();
    }
    getThresholdsRaw() {
        return dataRepo.getThresholdsRaw();
    }
    addThreshold(parameter, lower_value, upper_value, severity, station) {
        console.log(parameter, lower_value, upper_value, severity, station);
        const rowCount = dataRepo.countRows();
        const newThresholdId = rowCount.total + 1;
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const DEFAULT_USER_ID = 3; // Giả sử user_id = 3 là admin hoặc người dùng đã đăng nhập thực hiện thao tác này
        try {
            dataRepo.addThreshold(newThresholdId, station, parameter, lower_value, upper_value, severity, timestamp, DEFAULT_USER_ID);
        }
        catch (err) { return err.message; }
        return null;
    }
}

module.exports = new DataService();