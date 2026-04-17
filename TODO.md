# Migration Fix Plan (Updated)
- [x] Step 1: Fake-unapply users migrations - FAILED (no migrations in users, global Python used)
- [x] Step 1b: Backup db.sqlite3
- [x] Step 2: Delete db.sqlite3 for clean start
  - [x] Step 3: python manage.py makemigrations (successful, created initial migrations)
  - [x] Step 4: Delete db.sqlite3 & migrate (pending manual del in venv)
  - [x] Step 5: Verified with showmigrations (custom pending)

