# What changed in this commit

## Added features

1. Get all rows in table
[x] GET /accounts/all
2. Get 1 row by phone number (aka id)
[x] GET /accounts/:phone
3. Login
[x] GET /auth/login: open login page
[x] POST /auth/login: add session
4. Sign up
[x] GET /accounts/signup: open sign up page
[x] POST /accounts/signup: signup & add session
5. View dashboard
[x] GET /dashboard: open dashboard page, with information suitable for logged in user. If user isn't logged in, redirect to /auth/login.