import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String,
    Float, DateTime, ForeignKey,
    Boolean, Enum
)
from sqlalchemy.orm import relationship
from app.database import Base


class ServiceStatus(enum.Enum):
    up      = "up"
    down    = "down"
    unknown = "unknown"


class Service(Base):
    """
    Un service à surveiller.
    Exemple : { name: "DataPulse API",
                url: "https://mon-api.com/health" }
    """
    __tablename__ = "services"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False, unique=True)
    url        = Column(String(500), nullable=False)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relation vers l'historique des checks
    checks = relationship("Check", back_populates="service")

    def __repr__(self):
        return f"<Service name={self.name} url={self.url}>"


class Check(Base):
    """
    Un résultat de vérification d'un service.
    Stocké à chaque ping — toutes les 30 secondes.
    """
    __tablename__ = "checks"

    id               = Column(Integer, primary_key=True, index=True)
    service_id       = Column(Integer, ForeignKey("services.id"), nullable=False)
    status           = Column(Enum(ServiceStatus), default=ServiceStatus.unknown)
    response_time_ms = Column(Float, nullable=True)
    status_code      = Column(Integer, nullable=True)
    error_message    = Column(String(500), nullable=True)
    checked_at       = Column(DateTime, default=datetime.utcnow)

    # Relation inverse
    service = relationship("Service", back_populates="checks")

    def __repr__(self):
        return f"<Check service_id={self.service_id} status={self.status}>"