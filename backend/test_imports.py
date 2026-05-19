
import sys
import os
sys.path.append(os.getcwd())

try:
    from app.api import tracking, stats, logs, suggestions, chatbot
    print("API routers imported")
    from app.database import engine, Base
    print("Database imported")
    from app.services import carbon_tracker, system_monitor
    print("Services imported")
    print("All imports successful!")
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
