const accountsRepo = require("../repositories/accounts.repo");

class AuthService {
  login(id, password) {
    // console.log('id:', id);
    // console.log('pass:', password);
    const users = accountsRepo.findById(id); // returns object or undefined
    if (users.length <= 0) { return { err: 404, user: null }; } // user not found
    
    const user = users[0];
    if (password != user.password_hash) {
      return { err: 422, user: null }; // wrong password
    }
    return { err: 0, user: user };
  }
}

module.exports = new AuthService();