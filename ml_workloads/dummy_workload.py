import requests
import time
import random

BACKEND_URL = "http://localhost:8000/api/v1"

def run_dummy_workload(project_name="Dummy Workload"):
    print(f"Starting tracking for {project_name}...")
    response = requests.post(f"{BACKEND_URL}/tracking", json={"action": "start", "project": project_name})
    print(response.json())

    print("Running dummy workload (simulating high CPU usage)...")
    start_time = time.time()
    duration = 30 # seconds
    while time.time() - start_time < duration:
        # Some CPU intensive dummy work
        [random.random() for _ in range(100000)]
        time.sleep(1)
        print(f"Elapsed: {int(time.time() - start_time)}s", end='\r')

    print("\nStopping tracking...")
    response = requests.post(f"{BACKEND_URL}/tracking", json={"action": "stop", "project": project_name})
    result = response.json()
    print("Tracking Results:")
    print(result)

if __name__ == "__main__":
    run_dummy_workload()
