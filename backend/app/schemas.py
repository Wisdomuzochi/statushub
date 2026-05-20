from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import datetime


# ── Schémas Service ──────────────────────────────────────────

class ServiceCreate(BaseModel):
    """Ce qu'on reçoit pour créer un service."""
    name: str = Field(..., min_length=2, max_length=100,
                      example="DataPulse API")
    url: HttpUrl = Field(..., example="https://mon-api.com/health")


class ServiceOut(BaseModel):
    """Ce qu'on renvoie quand on lit un service."""
    id:         int
    name:       str
    url:        str
    is_active:  bool
    created_at: datetime
    status:     Optional[str] = None
    last_check: Optional[datetime] = None
    last_response_time_ms: Optional[float] = None

    class Config:
        from_attributes = True


# ── Schémas Check ────────────────────────────────────────────

class CheckOut(BaseModel):
    """Ce qu'on renvoie pour un résultat de vérification."""
    id:               int
    service_id:       int
    status:           str
    response_time_ms: Optional[float]
    status_code:      Optional[int]
    error_message:    Optional[str]
    checked_at:       datetime

    class Config:
        from_attributes = True


# ── Schéma Stats ─────────────────────────────────────────────

class ServiceStats(BaseModel):
    """Statistiques d'uptime d'un service."""
    service_id:       int
    service_name:     str
    uptime_percent:   float
    avg_response_ms:  float
    total_checks:     int
    checks_up:        int
    checks_down:      int