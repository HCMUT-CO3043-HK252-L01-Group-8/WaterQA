# What changed in this commit

## Added
- Python sript to retreive data from Adafruit.io (trial only). Running instruction is as follows:
	+ Go into src/backend/utils/python
	+ If you don't have venv/ in python/ yet, run `python3 -m venv venv` to create the venv first. This is done once.
	+ Run `./venv/bin/activate` to activate Python virtual environment. You will see a `(venv)` appearing before command prompt.
	+ Run `pip install -r requirements.txt` to install dependencies into virtual environment (doesn't affect your system). This is done once.
	+ Run `data.py` with different **feeds** to retreive data.
	+ Once completed, run `deactivate` to deactivate the virtual environment.

**Note:** Whenever you start a Python project, you should create venv and install dependencies into it! Export dependencies to requirements by running `pip freeze > requirements.txt`

## Updated
- Update .gitignore to ignore venv directory.