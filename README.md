# WaterQA

A water quality monitoring app, created for personal use on mobile platform.

## Developing conventions

### Directory structure

```
/
├── src/
|   ├── frontend
|   ├── backend
|   ├── embedded
├── tests/
├── config/
├── build/
├── docs/
├── assets/
```

Explanation:
- `/src`: source code
- `/test`: modular & system tests
- `/config`: configuration files
- `/build`: files used in or generated in build phase
- `/docs`: documents (not including README)
- `/assets`: image, sound, etc.

## Branch name
- `release/[version name]`: usable, releasable product with complete README file
- `main`: executable snapshot
- `feature/[task number]-[feature name]`: a specific feature
- `bugfix/[task number]-[feature name]`: to fix bug for "feature" branches
- `hotfix/[task number]-[error name]`: to fix bug from "main"
- `docs`: document

Example names:
- `feature/T-456-user-authentication`
- `bugfix/T-789-fix-header-styling`
- `hotfix/T-321-security-patch`
- `release/v2.0.1`
- `docs/T-654-update-readme`

Task number looks like: `T-xxx`. One task number is aligned with a specific task, declared on Telegram group. If there's no task number, just ignore it, e.g. `feature/user-authentication`.
Names shall be written in English. Names with many word shall be separated by hyphens (-).

### Commit message

- Written in English and present simple tense, with subject "I" omitted.
- Describe briefly what you did in the commit.
- Can include many sentences, but the final sentence's period (.) should be omitted.
- In feature and fix branches, a commit message should looks like: "[Add/Edit/Remove] [feature/error]: [next sentences]"

Example:
- "Add login form"
- "Edit history view: add "summary" button"

## Frontend - backend API

|Method|Endpoint|Description|
|---|---|---|
|GET|/|Same as /dashboard|
|GET|/accounts/all|Get all rows from Accounts table in DB in JSON format|
|GET|/accounts/id/:phone|Get 1 row by phone number (also UID) in JSON format|
|GET|/auth/login/|Open login page|
|GET|/accounts/signup/|Open sign up page|
|GET|/dashboard|Open dashboard page with information suitable for current session. If a session doesn't exist, redirect to /auth/login|
|GET|/accounts/changePassword|Open change password page|
|POST|/auth/login/|Login (actually create a session) and redirect to dashboard|
|POST|/accounts/signup|Create account, login and redirect to dashboard|
|POST|/accounts/changePassword|Change password|

Read more at [this file](./docs/api.md).

## Unsolved errors

Read more [here](./docs/errors.md).

