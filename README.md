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
- /src: source code
- /test: modular & system tests
- /config: configuration files
- /build: files used in or generated in build phase
- /docs: documents (not including README)
- /assets: image, sound, etc.

## Branch name
- release/[version name]: usable, releasable product with complete README file
- main: executable snapshot
- feature/[task number]-[feature name]: a specific feature
- bugfix/[task number]-[feature name]: to fix bug for "feature" branches
- hotfix/[task number]-[error name]: to fix bug from "main"
- docs: document

Example names:
- feature/T-456-user-authentication
- bugfix/T-789-fix-header-styling
- hotfix/T-321-security-patch
- release/v2.0.1
- docs/T-654-update-readme

Task number looks like: T-xxx. One task number is aligned with a specific task, declared on Telegram group.
Names shall be written in English. Names with many word shall be separated by hyphens (-).

### Commit message

- Written in English and present simple tense, with subject "I" omitted.
- Describe briefly what you did in the commit.
- Can include many sentences, but the final sentence's period (.) should be omitted.
- In feature and fix branches, a commit message should looks like: "[Add/Edit/Remove] [feature/error]: [next sentences]"

Example:
- "Add login form"
- "Edit history view: add "summary" button"