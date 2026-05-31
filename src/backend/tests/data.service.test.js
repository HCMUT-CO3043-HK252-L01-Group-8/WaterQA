// tests/data.service.test.js
// Unit tests cho DataService — mock data.repo và global.fetch

jest.mock('../repositories/data.repo');

const dataRepo = require('../repositories/data.repo');
const dataService = require('../services/data.service');

// ============================================================
// TEST: getDataHistory()
// ============================================================
describe('DataService.getDataHistory()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Gọi repo với đúng row_num và trả về kết quả', () => {
        const mockData = [
            { observation_id: 1, value: 7.5 },
            { observation_id: 2, value: 8.0 },
        ];
        dataRepo.getDataHistory.mockReturnValue(mockData);

        const result = dataService.getDataHistory(10);

        expect(dataRepo.getDataHistory).toHaveBeenCalledWith(10);
        expect(result).toEqual(mockData);
    });
});

// ============================================================
// TEST: getDataHistoryNoLimit()
// ============================================================
describe('DataService.getDataHistoryNoLimit()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Gọi repo không có tham số limit và trả về kết quả', () => {
        const mockData = [
            { observation_id: 1, value: 7.5 },
            { observation_id: 2, value: 8.0 },
            { observation_id: 3, value: 6.2 },
        ];
        dataRepo.getDataHistoryNoLimit.mockReturnValue(mockData);

        const result = dataService.getDataHistoryNoLimit();

        expect(dataRepo.getDataHistoryNoLimit).toHaveBeenCalled();
        expect(result).toEqual(mockData);
    });
});

// ============================================================
// TEST: getThresholdsRaw()
// ============================================================
describe('DataService.getThresholdsRaw()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả đúng dữ liệu threshold từ repo', () => {
        const mockThresholds = [
            { threshold_id: 1, parameter_name: 'pH', lower_threshold: 6.5, upper_threshold: 8.5 },
            { threshold_id: 2, parameter_name: 'DO', lower_threshold: 4.0, upper_threshold: 10.0 },
        ];
        dataRepo.getThresholdsRaw.mockReturnValue(mockThresholds);

        const result = dataService.getThresholdsRaw();

        expect(dataRepo.getThresholdsRaw).toHaveBeenCalled();
        expect(result).toEqual(mockThresholds);
    });
});

// ============================================================
// TEST: getThresholdById()
// ============================================================
describe('DataService.getThresholdById()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về threshold theo id', () => {
        const mockThreshold = {
            threshold_id: 1,
            parameter_name: 'pH',
            lower_threshold: 6.5,
            upper_threshold: 8.5,
            severity_level: 'high',
        };
        dataRepo.getThresholdById.mockReturnValue(mockThreshold);

        const result = dataService.getThresholdById(1);

        expect(dataRepo.getThresholdById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockThreshold);
    });

    test('Trả về undefined nếu threshold không tồn tại', () => {
        dataRepo.getThresholdById.mockReturnValue(undefined);

        const result = dataService.getThresholdById(999);

        expect(result).toBeUndefined();
    });
});

// ============================================================
// TEST: addThreshold()
// ============================================================
describe('DataService.addThreshold()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Thêm threshold thành công, trả về null', () => {
        dataRepo.countRows.mockReturnValue({ total: 5 });
        dataRepo.addThreshold.mockReturnValue(undefined);

        const result = dataService.addThreshold('pH', 6.5, 8.5, 'high', 1);

        expect(result).toBeNull();
        expect(dataRepo.countRows).toHaveBeenCalled();
        expect(dataRepo.addThreshold).toHaveBeenCalledWith(
            6,          // newThresholdId = 5 + 1
            1,          // station
            'pH',       // parameter
            6.5,        // lower_value
            8.5,        // upper_value
            'high',     // severity
            expect.any(String),  // timestamp
            3           // DEFAULT_USER_ID
        );
    });

    test('Trả về error message khi repo throw lỗi', () => {
        dataRepo.countRows.mockReturnValue({ total: 5 });
        dataRepo.addThreshold.mockImplementation(() => {
            throw new Error('UNIQUE constraint failed');
        });

        const result = dataService.addThreshold('pH', 6.5, 8.5, 'high', 1);

        expect(result).toBe('UNIQUE constraint failed');
    });
});

// ============================================================
// TEST: editThreshold()
// ============================================================
describe('DataService.editThreshold()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Chỉnh sửa threshold thành công, trả về null', () => {
        dataRepo.editThreshold.mockReturnValue(undefined);

        const result = dataService.editThreshold(1, 2, 'DO', 4.0, 10.0, 'medium');

        expect(result).toBeNull();
        expect(dataRepo.editThreshold).toHaveBeenCalledWith(
            1,           // thresholdId
            2,           // station_id
            'DO',        // parameter
            4.0,         // lower_threshold
            10.0,        // upper_threshold
            'medium',    // severity
            expect.any(String),  // timestamp
            3            // DEFAULT_USER_ID
        );
    });

    test('Trả về error message khi repo editThreshold throw lỗi', () => {
        dataRepo.editThreshold.mockImplementation(() => {
            throw new Error('DB update failed');
        });

        const result = dataService.editThreshold(1, 2, 'DO', 4.0, 10.0, 'medium');

        expect(result).toBe('DB update failed');
    });
});

// ============================================================
// TEST: deleteThreshold()
// ============================================================
describe('DataService.deleteThreshold()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Xóa threshold thành công', () => {
        dataRepo.deleteThreshold.mockReturnValue(undefined);

        const result = dataService.deleteThreshold(3);

        expect(result).toEqual({ success: true });
        expect(dataRepo.deleteThreshold).toHaveBeenCalledWith(3);
    });

    test('Trả về lỗi khi repo throw', () => {
        dataRepo.deleteThreshold.mockImplementation(() => {
            throw new Error('Row not found');
        });

        const result = dataService.deleteThreshold(999);

        expect(result.success).toBe(false);
        expect(result.err).toBe('Row not found');
    });
});

// ============================================================
// TEST: getTelemetryData()
// ============================================================
describe('DataService.getTelemetryData()', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        // Set biến môi trường giả cho Adafruit
        process.env = {
            ...originalEnv,
            ADAFRUIT_IO_KEY: 'test-aio-key',
            ADAFRUIT_IO_USERNAME: 'testuser',
        };
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    test('Trả về data và count khi fetch thành công', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const mockApiData = [
            { id: '1', value: '7.2', created_at: '2026-01-01T00:00:00Z' },
            { id: '2', value: '7.5', created_at: '2026-01-01T01:00:00Z' },
        ];
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockApiData,
        });

        const result = await dataService.getTelemetryData('ph-sensor', 10);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://io.adafruit.com/api/v2/testuser/feeds/ph-sensor/data?limit=10',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'X-AIO-Key': 'test-aio-key',
                }),
            })
        );
        expect(result.data).toEqual(mockApiData);
        expect(result.count).toBe(2);

        consoleLogSpy.mockRestore();
    });

    test('Gọi URL không có limit nếu rowLimit không truyền', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const mockApiData = [{ id: '1', value: '7.2' }];
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockApiData,
        });

        await dataService.getTelemetryData('ph-sensor', null);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://io.adafruit.com/api/v2/testuser/feeds/ph-sensor/data',
            expect.any(Object)
        );

        consoleLogSpy.mockRestore();
    });

    test('Trả về undefined khi fetch lỗi (network error)', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

        const result = await dataService.getTelemetryData('ph-sensor', 10);

        // Service catch lỗi và không throw → trả về undefined
        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to fetch data:',
            'Network error'
        );

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test('Trả về undefined khi response not ok (HTTP error)', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 403,
        });

        const result = await dataService.getTelemetryData('ph-sensor', 10);

        expect(result).toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to fetch data:',
            'HTTP error! status: 403'
        );

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
