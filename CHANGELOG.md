# What changed in this commit

## Added
- Feature: monitor history. Details in API doc.

## Removed
- Redundant metadata files for sqlite (like .db-shm). These files are automatically generated when we open .sql file using DB Browser, then deleted after .sql file closed.

## Notes

- Make sure to check the SQL file path when running on a different machine!
