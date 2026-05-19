#!/usr/bin/env python3

import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_endpoint(url, method='GET', data=None):
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        else:
            print(f"Unsupported method: {method}")
            return

        print(f"Testing {method} {url}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.json())
        else:
            print("Error:", response.text)
        print("-" * 50)

    except requests.exceptions.RequestException as e:
        print(f"Error testing {url}: {e}")
        print("-" * 50)

def test_api():
    # Test current tracking data
    test_endpoint(f"{BASE_URL}/tracking/current")

    # Test stats projects
    test_endpoint(f"{BASE_URL}/stats/projects")

    # Test logs
    test_endpoint(f"{BASE_URL}/logs/")

    # Test suggestions for a project (assuming 'test' project exists)
    test_endpoint(f"{BASE_URL}/suggestions/?project=test")

    # Test carbon total
    test_endpoint(f"{BASE_URL}/stats/carbon/total")

    # Test system average
    test_endpoint(f"{BASE_URL}/stats/system/average")

if __name__ == "__main__":
    test_api()