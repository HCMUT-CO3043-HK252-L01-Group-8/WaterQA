// tests/device.service.test.js
// Unit tests cho DeviceService — mock device.repo

jest.mock('../repositories/device.repo');

const deviceRepo = require('../repositories/device.repo');
const deviceService = require('../services/device.service');

// ============================================================
// TEST: getAll()
// ============================================================
describe('DeviceService.getAll()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về danh sách tất cả sensor', () => {
        const mockSensors = [
            { sensor_id: 1, sensor_name: 'pH Sensor', status: 'active' },
            { sensor_id: 2, sensor_name: 'DO Sensor', status: 'inactive' },
        ];
        deviceRepo.findAll.mockReturnValue(mockSensors);

        const result = deviceService.getAll();

        expect(deviceRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockSensors);
        expect(result).toHaveLength(2);
    });
});

// ============================================================
// TEST: getById()
// ============================================================
describe('DeviceService.getById()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về sensor theo id', () => {
        const mockSensor = { sensor_id: 1, sensor_name: 'pH Sensor', status: 'active' };
        deviceRepo.findById.mockReturnValue(mockSensor);

        const result = deviceService.getById(1);

        expect(deviceRepo.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockSensor);
    });

    test('Trả về undefined nếu sensor không tồn tại', () => {
        deviceRepo.findById.mockReturnValue(undefined);

        const result = deviceService.getById(999);

        expect(result).toBeUndefined();
    });
});

// ============================================================
// TEST: switchSensor()
// ============================================================
describe('DeviceService.switchSensor()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Chuyển sensor từ active sang inactive', () => {
        deviceRepo.findById.mockReturnValue({
            sensor_id: 1,
            sensor_name: 'pH Sensor',
            status: 'active',
        });
        deviceRepo.updateStatus.mockReturnValue(undefined);

        deviceService.switchSensor(1);

        expect(deviceRepo.updateStatus).toHaveBeenCalledWith(1, 'inactive');
    });

    test('Chuyển sensor từ inactive sang active', () => {
        deviceRepo.findById.mockReturnValue({
            sensor_id: 2,
            sensor_name: 'DO Sensor',
            status: 'inactive',
        });
        deviceRepo.updateStatus.mockReturnValue(undefined);

        deviceService.switchSensor(2);

        expect(deviceRepo.updateStatus).toHaveBeenCalledWith(2, 'active');
    });

    test('Throw lỗi nếu sensor không tồn tại', () => {
        deviceRepo.findById.mockReturnValue(null);

        expect(() => deviceService.switchSensor(999)).toThrow('Sensor not found');
    });
});

// ============================================================
// TEST: addSensor()
// ============================================================
describe('DeviceService.addSensor()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Thêm sensor với status mặc định inactive', () => {
        deviceRepo.countRows.mockReturnValue({ total: 5 });
        deviceRepo.add.mockReturnValue(undefined);

        deviceService.addSensor(1, 'New Sensor', 'temperature', '°C');

        expect(deviceRepo.add).toHaveBeenCalledWith(
            6,               // newId = 5 + 1
            1,               // station_id
            'New Sensor',    // sensor_name
            'temperature',   // sensor_type
            '°C',            // unit
            'inactive'       // DEFAULT_STATUS
        );
    });

    test('Thêm sensor với status được truyền vào', () => {
        deviceRepo.countRows.mockReturnValue({ total: 3 });
        deviceRepo.add.mockReturnValue(undefined);

        deviceService.addSensor(2, 'Active Sensor', 'pH', 'pH', 'active');

        expect(deviceRepo.add).toHaveBeenCalledWith(
            4,                // newId = 3 + 1
            2,                // station_id
            'Active Sensor',  // sensor_name
            'pH',             // sensor_type
            'pH',             // unit
            'active'          // status truyền vào
        );
    });

    test('Throw lỗi khi repo.add thất bại', () => {
        deviceRepo.countRows.mockReturnValue({ total: 5 });
        deviceRepo.add.mockImplementation(() => {
            throw new Error('UNIQUE constraint failed');
        });

        expect(() => {
            deviceService.addSensor(1, 'Dup Sensor', 'temperature', '°C');
        }).toThrow('Failed to add sensor: UNIQUE constraint failed');
    });
});

// ============================================================
// TEST: renameSensor()
// ============================================================
describe('DeviceService.renameSensor()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Đổi tên sensor thành công', () => {
        deviceRepo.findById.mockReturnValue({
            sensor_id: 1,
            sensor_name: 'Old Name',
            status: 'active',
        });
        deviceRepo.rename.mockReturnValue(undefined);

        deviceService.renameSensor(1, 'New Name');

        expect(deviceRepo.rename).toHaveBeenCalledWith(1, 'New Name');
    });

    test('Throw lỗi nếu sensor không tồn tại', () => {
        deviceRepo.findById.mockReturnValue(null);

        expect(() => {
            deviceService.renameSensor(999, 'New Name');
        }).toThrow('Sensor not found');
    });

    test('Throw lỗi khi repo.rename thất bại', () => {
        deviceRepo.findById.mockReturnValue({
            sensor_id: 1,
            sensor_name: 'Old Name',
            status: 'active',
        });
        deviceRepo.rename.mockImplementation(() => {
            throw new Error('DB rename error');
        });

        expect(() => {
            deviceService.renameSensor(1, 'New Name');
        }).toThrow('Failed to rename sensor: DB rename error');
    });
});
