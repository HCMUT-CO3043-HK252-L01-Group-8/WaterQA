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
  addAccount(mail, phone, password, passwordAgain) {
  if (password != passwordAgain) {
    return 1;
  } else {
    const accs = accountsRepo.findByPhone(phone);

    if (accs) { 
      return 2; 
    } else {
      try {
        const row = accountsRepo.countRows();
        const id = row.total + 1;

        const createdAt = new Date().toISOString();

        accountsRepo.addAccount(
          id,
          mail,
          phone,
          password,
          "User",
          0,
          createdAt
        );
      } catch (err) {
        return 3;  // temporary. This is expected to give the exact SQL error (eg. duplicated phone number...)
      }

      return 0;
    }
  }
}

  changePassword(id, currentPass, newPass, confirmPass){
    const accs = accountsRepo.findById(id);
    if (accs.length <= 0) {return 1;} // unexpected error: account not found
    const acc = accs[0];
    if (currentPass != acc.password_hash){return 2;} // current password is wrong
    if (newPass != confirmPass){return 3;} // confirmed password is wrong
    
    const updateTime = new Date().toISOString();
    accountsRepo.changePassword(id, newPass, updateTime);
    return 0; 
  }
}

module.exports = new AccountsService();
