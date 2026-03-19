// services/accounts.service.js
const accountsRepo = require("../repositories/accounts.repo");

class AccountsService {
  getAllAccounts() {
    return accountsRepo.findAll(); // sync call
  }
  checkByPhone(phone){
    return accountsRepo.findByPhone(phone);
  }
  addAccount(phone, password, passwordAgain) {
    if (password != passwordAgain) {
      return 1;
    }
    else {
      const acc = accountsRepo.findByPhone(phone);
      if (acc.length > 0) { return 2; }
      else {
        accountsRepo.addAccount(phone, password);
        return 0;
      }
    }
  }
  changePassword(phone, currentPass, newPass, confirmPass){
    const accs = accountsRepo.findByPhone(phone);
    if (accs.length <= 0) {return 1;} // unexpected error: account not found
    const acc = accs[0];
    if (currentPass != acc.hashedPass){return 2;} // current password is wrong
    if (newPass != confirmPass){return 3;} // confirmed password is wrong
    
    accountsRepo.changePassword(phone, newPass);
    return 0; 
  }
}

module.exports = new AccountsService();
