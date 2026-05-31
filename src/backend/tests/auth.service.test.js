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
        expect(accountsRepo.addAccount).toHaveBeenCalled();
    });
});
