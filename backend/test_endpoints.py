import requests

def test_endpoints():
    # Test root endpoint
    print("Testing root endpoint...")
    try:
        response = requests.get('http://localhost:8000')
        print(f"Root response: {response.json()}")
    except Exception as e:
        print(f"Root error: {e}")

    # Test execute endpoint
    print("\nTesting execute endpoint...")
    try:
        response = requests.post(
            'http://localhost:8000/execute',
            json={
                "code": "print('test')",
                "language": "python"
            }
        )
        print(f"Execute response: {response.json()}")
    except Exception as e:
        print(f"Execute error: {e}")

    # Test analyze endpoint
    print("\nTesting analyze endpoint...")
    try:
        response = requests.post(
            'http://localhost:8000/analyze',
            json={
                "code": "print('test')",
                "language": "python"
            }
        )
        print(f"Analyze response: {response.json()}")
    except Exception as e:
        print(f"Analyze error: {e}")

if __name__ == "__main__":
    test_endpoints() 