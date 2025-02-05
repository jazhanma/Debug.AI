import sys
from pathlib import Path

# Add the project root to sys.path so Python can find the 'backend' package.
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_debug():
    payload = {"code": "print('Hello World')", "language": "python"}
    response = client.post("/debug/", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Check that expected keys exist in the response.
    assert "fixed_code" in data
    assert "explanation" in data
    assert "error_type" in data

def test_history():
    # Perform a debug call to make sure there's at least one history entry.
    client.post("/debug/", json={"code": "print('Hello World')", "language": "python"})
    response = client.get("/history")
    assert response.status_code == 200
    data = response.json()
    assert "history" in data
    # There should be at least one entry in the history.
    assert len(data["history"]) >= 1

def test_clear_history():
    # Clear the history.
    response = client.delete("/history")
    assert response.status_code == 200
    data = response.json()
    assert data.get("message") == "History cleared"
    # Confirm that history is now empty.
    response = client.get("/history")
    data = response.json()
    assert data["history"] == [] 