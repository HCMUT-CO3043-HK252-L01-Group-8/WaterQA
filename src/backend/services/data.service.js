const dataRepo = require('../repositories/data.repo');
const dayjs = require('dayjs');

class DataService {
    getDataHistory(row_num) {
        return dataRepo.getDataHistory(row_num);
    }
    getDataHistoryNoLimit() {
        return dataRepo.getDataHistoryNoLimit();
    }

    async getTelemetryData(feedKey, rowLimit) {
        try {
            const aiokey = process.env.ADAFRUIT_IO_KEY;
            const username = process.env.ADAFRUIT_IO_USERNAME;
            let URL = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`;
            if (rowLimit) {
                URL += `?limit=${rowLimit}`;
            }


            console.log(`Fetching data from ${feedKey}...`);
            
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'X-AIO-Key': aiokey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const count = data.length;
            return {data, count};

        } catch (error) {
            console.error("Failed to fetch data:", error.message);
        }
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
    }
}

module.exports = new DataService();