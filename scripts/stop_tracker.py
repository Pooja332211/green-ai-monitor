#!/usr/bin/env python3

import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def stop_tracking():
    try:
        # Stop carbon tracking
        response = requests.post(f"{BASE_URL}/tracking/carbon/stop")
        if response.status_code == 200:
            print("Carbon tracking stopped successfully.")
            data = response.json()
            if "emissions" in data:
                print(f"Emissions: {data['emissions']}")
        else:
            print(f"Failed to stop carbon tracking: {response.text}")

        # Stop system monitoring
        response = requests.post(f"{BASE_URL}/tracking/system/stop")
        if response.status_code == 200:
            print("System monitoring stopped successfully.")
            data = response.json()
            if "metrics" in data:
                print(f"Metrics: {data['metrics']}")
        else:
            print(f"Failed to stop system monitoring: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    stop_tracking()