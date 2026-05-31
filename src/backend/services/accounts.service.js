// services/accounts.service.js
const accountsRepo = require("../repositories/accounts.repo");

class AccountsService {
  getAllAccounts() {
    return accountsRepo.findAll(); // sync call
  }
  // obsoleted
  // checkByPhone(phone){
  //   return accountsRepo.findByPhone(phone);
  // }
  findById(id){
    return accountsRepo.findById(id);
  }
  addAccount(name, email, phone_number, password, passwordAgain) {
  if (passwordAgain && password !== passwordAgain) {
    return { errCode: 422 }; // confirmed password is wrong
  }

  // Kiểm tra email đã tồn tại chưa
  const existingByEmail = accountsRepo.findByEmail(email);
  if (existingByEmail.length > 0) {
    return { errCode: 409 }; // Email already exists
  }

  try {
    // Get the max user_id and add 1 instead of counting rows
    const maxIdResult = accountsRepo.getMaxUserId();
    const newId = (maxIdResult?.max_id || 0) + 1;
    console.log('New id: ' + newId);

    const createdAt = new Date().toISOString();

    accountsRepo.addAccount(
      newId,
      email,
      phone_number || null,
      password,
      'User', // role luôn là 'User' khi đăng ký, không cho phép client tự chọn
      0,
      createdAt,
      name || null  // lưu tên hiển thị
    );
    return { errCode: 0, newId: newId };
  } catch (err) {
    console.log(err);
    return { errCode: 500 };
  }
}

  changePassword(id, currentPass, newPass, confirmPass){
    const accs = accountsRepo.findById(id);
    if (accs.length <= 0) {return 404;} // unexpected error: account not found
    const acc = accs[0];
    if (currentPass != acc.password_hash){return 422;} // current password is wrong
    if (newPass != confirmPass){return 422;} // confirmed password is wrong

    const updateTime = new Date().toISOString();
    accountsRepo.changePassword(id, newPass, updateTime);
    return 0;
  }

  deleteAccount(id){
    try {
      accountsRepo.deleteAccount(id);
      console.log("Delete account called");
      return 0;
    } catch (err) {
      return 500;
    }
  }

  updateEmailNotifications(userId, enabled) {
    return accountsRepo.updateEmailNotifications(userId, enabled);
  }
}

module.exports = new AccountsService();
