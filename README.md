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

Read [here](./docs/api.md).

## Unsolved errors

Read [here](./docs/errors.md).

## Feature developing progress
- [x] Auth
	- [x] Login
	- [x] Sign up
	- [x] Change password
	- [x] Log out
- [x] Dashboard
- [ ] Monitor data
	- [ ] Live monitor
	- [x] Monitor history
- [ ] Forecast data
- [x] Export file
- [ ] Manual input
- [ ] Manage IoT devices
	- [x] List devices (sensors)
	- [ ] Add, edit, remove device
	- [ ] API for backend to fetch data (from Adafruit.io)
- [ ] Manage users
	- [ ] List users (admin only)
	- [ ] Get "my" info (me = current session's user)
	- [ ] Edit "my" info 
- [ ] Alert when IoT device has errors
	- [ ] Detect error
	- [x] Give alert
- [ ] Alert when threshold crossed
	- [x] CRUD threshold
	- [x] Give alert

