const fs = require('fs');
const path = require('path');
const db = require('./database/db');
const { initSchema } = require('./database/initSchema');

console.log("Đang khởi tạo lại schema (nếu cần)...");
initSchema();

const csvPath = path.join(__dirname, '..', '..', 'water_potability.csv');

if (!fs.existsSync(csvPath)) {
    console.error("Không tìm thấy file water_potability.csv tại:", csvPath);
    process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const insertStmt = db.prepare(`
    INSERT INTO OBSERVATION (
        station_id, ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let count = 0;
// start from 1 to skip header
const now = new Date();

db.transaction(() => {
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        
        // Parse parts: ph,Hardness,Solids,Chloramines,Sulfate,Conductivity,Organic_carbon,Trihalomethanes,Turbidity,Potability
        const ph = parts[0] ? parseFloat(parts[0]) : null;
        const hardness = parts[1] ? parseFloat(parts[1]) : null;
        const solids = parts[2] ? parseFloat(parts[2]) : null;
        const chloramines = parts[3] ? parseFloat(parts[3]) : null;
        const sulfate = parts[4] ? parseFloat(parts[4]) : null;
        const conductivity = parts[5] ? parseFloat(parts[5]) : null;
        const organic_carbon = parts[6] ? parseFloat(parts[6]) : null;
        const trihalomethanes = parts[7] ? parseFloat(parts[7]) : null;
        const turbidity = parts[8] ? parseFloat(parts[8]) : null;
        
        // Bỏ qua nếu thiếu pH, Hardness, hoặc Chloramines (vì model AI yêu cầu đủ)
        if (ph !== null && hardness !== null && chloramines !== null && solids !== null && conductivity !== null) {
            const station_id = (count % 4) + 1; // Phân bổ cho trạm 1, 2, 3, 4
            // Dàn trải timestamp ra mỗi record cách nhau 1 giờ để nhìn đẹp trên biểu đồ lịch sử
            const recordTime = new Date(now.getTime() - count * 60 * 60 * 1000).toISOString();

            insertStmt.run(station_id, ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity, recordTime);
            count++;
        }
    }
})();

console.log(`[SEED] Thêm thành công ${count} dòng dữ liệu mẫu từ Kaggle cho 4 trạm.`);
