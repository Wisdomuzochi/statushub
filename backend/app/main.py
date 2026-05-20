from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.routes.services import router as services_router
from app.api.routes.checks import router as checks_router
import app.models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crée les tables au démarrage si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="StatusHub API",
    description="Plateforme de monitoring d'uptime en temps réel.",
    version="1.0.0",
    lifespan=lifespan,
)

# Autorise le frontend React à appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des routes
app.include_router(
    services_router,
    prefix="/api/services",
    tags=["Services"]
)
app.include_router(
    checks_router,
    prefix="/api/checks",
    tags=["Checks"]
)


@app.get("/")
def root():
    return {
        "service": "StatusHub API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}