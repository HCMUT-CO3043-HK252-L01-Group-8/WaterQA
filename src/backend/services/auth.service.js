const accountsRepo = require("../repositories/accounts.repo");

class AuthService {
  login(id, password) {
    // console.log('id:', id);
    // console.log('pass:', password);
    const users = accountsRepo.findById(id); // returns object or undefined
    if (users.length <= 0) { return { err: 1, user: null }; }
    
    const user = users[0];
    // console.log(user);
    if (password != user.password_hash) {
      return { err: 2, user: null };
    }
    return { err: 0, user: user };
  }
}

module.exports = new AuthService();