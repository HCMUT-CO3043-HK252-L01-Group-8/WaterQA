const accountsRepo = require("../repositories/accounts.repo");

class AuthService {
  login(id, password) {
    // id parameter contains email from frontend
    const users = accountsRepo.findByEmail(id);
    if (users.length <= 0) { return { err: 404, user: null }; } // user not found

    const user = users[0];
    if (password != user.password_hash) {
      return { err: 422, user: null }; // wrong password
    }
    return { err: 0, user: user };
  }

  loginWithGoogle(googleUser) {
    // googleUser = { name, email, picture }
    const { name, email, picture } = googleUser;
    
    // Try to find user by email
    const users = accountsRepo.findByEmail(email);
    
    let user;
    if (users.length > 0) {
      // User exists, use them
      user = users[0];
    } else {
      // Create new user from Google info
      try {
        const now = new Date().toISOString();
        accountsRepo.addAccount(
          null, // auto-increment id
          email,
          null, // phone
          'GOOGLE_OAUTH', // password_hash (using placeholder)
          'User', // role
          1, // verification_status (verified via Google)
          now
        );
        
        // Get the newly created user
        const newUsers = accountsRepo.findByEmail(email);
        if (newUsers.length > 0) {
          user = newUsers[0];
        } else {
          return { err: 500, user: null };
        }
      } catch (err) {
        console.error('Error creating Google user:', err);
        return { err: 500, user: null };
      }
    }

    return { err: 0, user: user };
  }
}

module.exports = new AuthService();
