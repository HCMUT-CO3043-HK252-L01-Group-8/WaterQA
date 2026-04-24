// services/accounts.service.js
const { deleteAccount } = require("../controllers/accounts.controller");
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
    return {errCode: 422}; // confirmed password is wrong
  } else {
    const accs = accountsRepo.findByPhone(phone);

    if (accs) {
      return {errCode: 409};  // Phone number already exists
    } else {
      try {
        const row = accountsRepo.countRows();
        const newId = row.total + 1;
        console.log("New id: " + newId);

        const createdAt = new Date().toISOString();

        accountsRepo.addAccount(
          newId,
          mail,
          phone,
          password,
          "User",
          0,
          createdAt
        );
        return { errCode: 0, newId: newId }; // success. Return the new account's ID for session creation. This can be used at Controller layer because it is not related to database operation.
      } catch (err) {
        console.log(err);
        return {errCode: 500};  // temporary. This is expected to give the exact SQL error (eg. duplicated phone number...)
      }

    }
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
      return 500; // temporary. This is expected to give the exact SQL error (eg. account not found...)
    }
  }
}

module.exports = new AccountsService();
