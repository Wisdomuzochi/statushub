def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "StatusHub" in response.json()["service"]


def test_get_services_empty(client):
    response = client.get("/api/services/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_service(client):
    response = client.post("/api/services/", json={
        "name": "Test Service",
        "url": "https://httpbin.org/get"
    })
    assert response.status_code == 200
    assert response.json()["name"] == "Test Service"
    assert response.json()["status"] == "unknown"


def test_create_duplicate_service(client):
    client.post("/api/services/", json={
        "name": "Duplicate",
        "url": "https://httpbin.org/get"
    })
    response = client.post("/api/services/", json={
        "name": "Duplicate",
        "url": "https://httpbin.org/get"
    })
    assert response.status_code == 400