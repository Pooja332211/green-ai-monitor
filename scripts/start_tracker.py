#!/usr/bin/env python3

import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def start_tracking(project):
    try:
        # Start carbon tracking
        response = requests.post(f"{BASE_URL}/tracking/carbon/start", json={"project": project})
        if response.status_code == 200:
            print("Carbon tracking started successfully.")
        else:
            print(f"Failed to start carbon tracking: {response.text}")

        # Start system monitoring
        response = requests.post(f"{BASE_URL}/tracking/system/start", json={"project": project})
        if response.status_code == 200:
            print("System monitoring started successfully.")
        else:
            print(f"Failed to start system monitoring: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python start_tracker.py <project_name>")
        sys.exit(1)

    project = sys.argv[1]
    start_tracking(project)