import requests
import time
import sys
import os

def test_server():
    print("\nTesting FastAPI Server...")
    url = "http://localhost:8080"
    
    try:
        print(f"Attempting to connect to {url}")
        response = requests.get(url)
        print(f"Status code: {response.status_code}")
        print(f"Raw response text: {response.text}")
        data = response.json()
        print(f"JSON response: {data}")
        
        if response.status_code == 200:
            print("✓ Server is running and responding")
            return True
        else:
            print("✗ Server responded with unexpected status code")
            return False
            
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to server - is it running?")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    test_server()  # Simplified to one attempt for debugging