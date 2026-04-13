const dataRepo = require('../repositories/data.repo');

class DataService{
    getDataHistory(row_num){
        return dataRepo.getDataHistory(row_num);
    }
    getDataHistoryNoLimit(){
        return dataRepo.getDataHistoryNoLimit();
    }
}

module.exports = new DataService();