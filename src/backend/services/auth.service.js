const accountsRepo = require("../repositories/accounts.repo");
// const accountsService = require("./accounts.service");

class AuthService {
  login(phone, password) {
    const userArr = accountsRepo.findByPhone(phone); // returns object or undefined
    console.log(userArr);
    if (userArr.length <= 0) { return false; }
    const user = userArr[0];
    if (password != user.hashedPass) {
      return false;
    }
    return true;
  }
}

module.exports = new AuthService();