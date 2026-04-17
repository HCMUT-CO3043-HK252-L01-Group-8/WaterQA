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
    getThresholdById(id) {
        return dataRepo.getThresholdById(id);
    }
    addThreshold(parameter, lower_value, upper_value, severity, station) {
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
    editThreshold(thresholdId, station_id, parameter, lower_threshold, upper_threshold, severity) {
        // To be developed: implement editThreshold function in dataRepo and call here
        // For now, just return null to indicate success (to avoid error in controller)
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const DEFAULT_USER_ID = 3; // Giả sử user_id = 3 là admin hoặc người dùng đã đăng nhập thực hiện thao tác này
        try {
            dataRepo.editThreshold(thresholdId, station_id, parameter, lower_threshold, upper_threshold, severity, timestamp, DEFAULT_USER_ID);
        }
        catch (err) { return err.message; }
        return null;
    }
    deleteThreshold(thresholdId) {
        try {
            dataRepo.deleteThreshold(thresholdId);
            return { success: true };
        }
        catch (err) { return { success: false, err: err.message }; }
        return null;
    }
}

module.exports = new DataService();