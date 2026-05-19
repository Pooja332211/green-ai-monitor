import os
import sys
import time

# Add backend to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.services.carbon_tracker import carbon_tracker

def run_dummy():
    print("Starting Dummy Workload...")
    carbon_tracker.start("Dummy Workload")
    
    # Simulate work
    # 300 seconds as requested by user, but maybe shorter for testing?
    # I'll keep it 300 but add a print
    duration = 300
    print(f"Simulating work for {duration} seconds...")
    time.sleep(duration)
    
    result = carbon_tracker.stop()
    print(f"Workload Completed!")
    if result:
        print(f"Project: {result['project']}")
        print(f"Emissions: {result['emissions']} kg CO2")
        print(f"Duration: {result['duration']} seconds")

if __name__ == "__main__":
    run_dummy()