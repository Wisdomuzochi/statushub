import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base


@pytest.fixture(autouse=True)
def create_tables():
    """
    Crée toutes les tables avant chaque test
    et les supprime après.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)