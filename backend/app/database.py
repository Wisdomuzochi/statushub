from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


# Connexion à PostgreSQL
engine = create_engine(settings.database_url)

# Fabrique de sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Classe de base pour tous les modèles
class Base(DeclarativeBase):
    pass


# Dépendance FastAPI — injectée dans chaque route
def get_db():
    """
    Ouvre une session BDD avant chaque requête
    et la ferme proprement après — même en cas d'erreur.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()