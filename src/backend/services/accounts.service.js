// services/accounts.service.js
const accountsRepo = require("../repositories/accounts.repo");

// class AccountsService {
//   async getAllAccounts() {
//     const accounts = await accountsRepo.findAll();

//     // You can add business rules / transformations here later, e.g.:
//     // * hide full hashedPass
//     // * add calculated fields
//     // * filter something
//     // * throw domain-specific errors

//     return accounts;
//   }
// }

class AccountsService {
  getAllAccounts() {
    return accountsRepo.findAll(); // sync call
    // const result = accountsRepo.findAll();
    // console.log("[SERVICE] Returning:", result);
    // return result;
  }
  // findByPhone(phone) {
  //   return accountsRepo.findByPhone(phone);
  // }
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
}

module.exports = new AccountsService();
