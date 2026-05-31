// tests/auth.service.test.js
// Unit tests cho AuthService — mock database và mail để test logic thuần

jest.mock('../repositories/accounts.repo');
jest.mock('../repositories/otp.repo');
jest.mock('../services/mail.service');

const accountsRepo = require('../repositories/accounts.repo');
const otpRepo = require('../repositories/otp.repo');
const mailService = require('../services/mail.service');

// Load service SAU khi mock
const authService = require('../services/auth.service');

// ============================================================
// TEST: login()
// ============================================================
describe('AuthService.login()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về lỗi 404 nếu email không tồn tại', () => {
        accountsRepo.findByEmail.mockReturnValue([]);

        const result = authService.login('notfound@gmail.com', 'anypassword');

        expect(result.err).toBe(404);
        expect(result.user).toBeNull();
    });

    test('Trả về lỗi 422 nếu sai mật khẩu', () => {
        accountsRepo.findByEmail.mockReturnValue([{
            user_id: 1,
            email: 'user@gmail.com',
            password_hash: 'correctpassword'
        }]);

        const result = authService.login('user@gmail.com', 'wrongpassword');

        expect(result.err).toBe(422);
        expect(result.user).toBeNull();
    });

    test('Trả về user nếu đăng nhập thành công', () => {
        const mockUser = {
            user_id: 1,
            email: 'user@gmail.com',
            password_hash: 'correctpassword'
        };
        accountsRepo.findByEmail.mockReturnValue([mockUser]);

        const result = authService.login('user@gmail.com', 'correctpassword');

        expect(result.err).toBe(0);
        expect(result.user).toEqual(mockUser);
    });
});

// ============================================================
// TEST: forgotPassword()
// ============================================================
describe('AuthService.forgotPassword()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về lỗi 404 nếu email không tồn tại', async () => {
        accountsRepo.findByEmail.mockReturnValue([]);

        const result = await authService.forgotPassword('notfound@gmail.com');

        expect(result.err).toBe(404);
        expect(result.message).toMatch(/không tồn tại/i);
    });

    test('Tạo OTP, gọi mail service, và trả về thành công', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        accountsRepo.findByEmail.mockReturnValue([{
            user_id: 1,
            email: 'user@gmail.com'
        }]);
        otpRepo.upsert.mockReturnValue(undefined);
        otpRepo.deleteExpired.mockReturnValue(undefined);
        mailService.sendOTPEmail.mockResolvedValue(true);

        const result = await authService.forgotPassword('user@gmail.com');

        expect(result.err).toBe(0);
        expect(otpRepo.upsert).toHaveBeenCalledWith(
            'user@gmail.com',
            expect.any(String),  // OTP ngẫu nhiên
            expect.any(Number)   // expires_at
        );
        expect(mailService.sendOTPEmail).toHaveBeenCalledWith(
            'user@gmail.com',
            expect.any(String)
        );

        consoleLogSpy.mockRestore();
    });

    test('Vẫn trả về thành công khi mail service lỗi (fallback terminal)', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        accountsRepo.findByEmail.mockReturnValue([{
            user_id: 1,
            email: 'user@gmail.com'
        }]);
        otpRepo.upsert.mockReturnValue(undefined);
        otpRepo.deleteExpired.mockReturnValue(undefined);
        mailService.sendOTPEmail.mockRejectedValue(new Error('SMTP error'));

        const result = await authService.forgotPassword('user@gmail.com');

        // Service vẫn trả về thành công dù mail lỗi (dùng OTP từ terminal)
        expect(result.err).toBe(0);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[OTP] Brevo failed:',
            'SMTP error'
        );

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});

// ============================================================
// TEST: verifyOTP()
// ============================================================
describe('AuthService.verifyOTP()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về lỗi 400 nếu không tìm thấy OTP record', () => {
        otpRepo.findByEmail.mockReturnValue(null);

        const result = authService.verifyOTP('user@gmail.com', '123456');

        expect(result.err).toBe(400);
    });

    test('Trả về lỗi 400 nếu OTP đã hết hạn', () => {
        otpRepo.findByEmail.mockReturnValue({
            otp: '123456',
            expires_at: Date.now() - 1000 // đã hết hạn 1 giây trước
        });
        otpRepo.deleteByEmail.mockReturnValue(undefined);

        const result = authService.verifyOTP('user@gmail.com', '123456');

        expect(result.err).toBe(400);
        expect(result.message).toMatch(/hết hạn/i);
        expect(otpRepo.deleteByEmail).toHaveBeenCalledWith('user@gmail.com');
    });

    test('Trả về lỗi 400 nếu OTP sai', () => {
        otpRepo.findByEmail.mockReturnValue({
            otp: '999999',
            expires_at: Date.now() + 60000 // còn 1 phút
        });

        const result = authService.verifyOTP('user@gmail.com', '123456');

        expect(result.err).toBe(400);
        expect(result.message).toMatch(/không đúng/i);
    });

    test('Trả về thành công nếu OTP đúng và còn hạn', () => {
        otpRepo.findByEmail.mockReturnValue({
            otp: '123456',
            expires_at: Date.now() + 60000
        });

        const result = authService.verifyOTP('user@gmail.com', '123456');

        expect(result.err).toBe(0);
    });
});

// ============================================================
// TEST: resetPassword()
// ============================================================
describe('AuthService.resetPassword()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về lỗi 400 nếu OTP không hợp lệ', () => {
        otpRepo.findByEmail.mockReturnValue(null);

        const result = authService.resetPassword('user@gmail.com', '123456', 'newpass');

        expect(result.err).toBe(400);
    });

    test('Cập nhật mật khẩu thành công', () => {
        otpRepo.findByEmail.mockReturnValue({
            otp: '123456',
            expires_at: Date.now() + 60000
        });
        accountsRepo.updatePassword.mockReturnValue({ changes: 1 });
        otpRepo.deleteByEmail.mockReturnValue(undefined);

        const result = authService.resetPassword('user@gmail.com', '123456', 'newpassword123');

        expect(result.err).toBe(0);
        expect(accountsRepo.updatePassword).toHaveBeenCalledWith('user@gmail.com', 'newpassword123');
        expect(otpRepo.deleteByEmail).toHaveBeenCalledWith('user@gmail.com');
    });

    test('Trả về lỗi 500 nếu update database lỗi', () => {
        otpRepo.findByEmail.mockReturnValue({
            otp: '123456',
            expires_at: Date.now() + 60000
        });
        accountsRepo.updatePassword.mockImplementation(() => {
            throw new Error('Database write error');
        });

        const result = authService.resetPassword('user@gmail.com', '123456', 'newpass');

        expect(result.err).toBe(500);
        expect(result.message).toMatch(/lỗi/i);
    });
});

// ============================================================
// TEST: loginWithGoogle()
// ============================================================
describe('AuthService.loginWithGoogle()', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Trả về user đã tồn tại nếu email đã có trong DB', () => {
        const existingUser = { user_id: 5, email: 'google@gmail.com', name: 'Google User' };
        accountsRepo.findByEmail.mockReturnValue([existingUser]);

        const result = authService.loginWithGoogle({
            name: 'Google User',
            email: 'google@gmail.com',
            picture: 'https://picture.url'
        });

        expect(result.err).toBe(0);
        expect(result.user).toEqual(existingUser);
        expect(accountsRepo.addAccount).not.toHaveBeenCalled();
    });

    test('Tạo user mới nếu email chưa tồn tại', () => {
        const newUser = { user_id: 10, email: 'newgoogle@gmail.com', name: 'New User' };
        accountsRepo.findByEmail
            .mockReturnValueOnce([])       // lần 1: chưa có
            .mockReturnValueOnce([newUser]); // lần 2: sau khi tạo
        accountsRepo.addAccount.mockReturnValue({ lastInsertRowid: 10 });

        const result = authService.loginWithGoogle({
            name: 'New User',
            email: 'newgoogle@gmail.com',
            picture: ''
        });

        expect(result.err).toBe(0);
        expect(result.user).toEqual(newUser);
        expect(accountsRepo.addAccount).toHaveBeenCalled();
    });

    test('Trả về lỗi 500 nếu tạo user nhưng không lấy lại được', () => {
        accountsRepo.findByEmail
            .mockReturnValueOnce([])   // lần 1: chưa có
            .mockReturnValueOnce([]);  // lần 2: vẫn rỗng sau khi tạo
        accountsRepo.addAccount.mockReturnValue({ lastInsertRowid: 10 });

        const result = authService.loginWithGoogle({
            name: 'Ghost User',
            email: 'ghost@gmail.com',
            picture: ''
        });

        expect(result.err).toBe(500);
        expect(result.user).toBeNull();
    });

    test('Trả về lỗi 500 nếu addAccount throw exception', () => {
        accountsRepo.findByEmail.mockReturnValue([]);
        accountsRepo.addAccount.mockImplementation(() => {
            throw new Error('DB insert failed');
        });

        const result = authService.loginWithGoogle({
            name: 'Error User',
            email: 'error@gmail.com',
            picture: ''
        });

        expect(result.err).toBe(500);
        expect(result.user).toBeNull();
    });

    test('Truyền null khi name là falsy (cover branch name || null)', () => {
        const newUser = { user_id: 20, email: 'noname@gmail.com', name: null };
        accountsRepo.findByEmail
            .mockReturnValueOnce([])         // lần 1: chưa có
            .mockReturnValueOnce([newUser]);  // lần 2: sau khi tạo
        accountsRepo.addAccount.mockReturnValue({ lastInsertRowid: 20 });

        const result = authService.loginWithGoogle({
            name: '',    // falsy → name || null sẽ thành null
            email: 'noname@gmail.com',
            picture: ''
        });

        expect(result.err).toBe(0);
        expect(result.user).toEqual(newUser);
        // Kiểm tra addAccount được gọi với tham số cuối là null (name || null)
        expect(accountsRepo.addAccount).toHaveBeenCalledWith(
            null,
            'noname@gmail.com',
            null,
            'GOOGLE_OAUTH',
            'User',
            1,
            expect.any(String),
            null  // name || null khi name = ''
        );
    });
});
