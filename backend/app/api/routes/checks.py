from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Check
from app.schemas import CheckOut
from typing import List

router = APIRouter()


@router.get("/{service_id}", response_model=List[CheckOut])
def get_checks(
    service_id: int,
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Retourne l'historique des checks pour un service.
    Utilisé pour afficher le graphique de latence.
    limit=50 par défaut → les 25 dernières minutes.
    """
    checks = db.query(Check).filter(
        Check.service_id == service_id
    ).order_by(
        Check.checked_at.desc()
    ).limit(limit).all()

    return [
        CheckOut(
            id=c.id,
            service_id=c.service_id,
            status=c.status.value,
            response_time_ms=c.response_time_ms,
            status_code=c.status_code,
            error_message=c.error_message,
            checked_at=c.checked_at,
        )
        for c in checks
    ]