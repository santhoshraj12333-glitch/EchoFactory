$env:PYTHONIOENCODING = "utf-8"
& "$PSScriptRoot\venv\Scripts\python.exe" -m uvicorn app:app --host 0.0.0.0 --port 8000