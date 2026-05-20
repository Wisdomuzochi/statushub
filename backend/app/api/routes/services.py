from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Service, Check, ServiceStatus
from app.schemas import ServiceCreate, ServiceOut, ServiceStats
from typing import List

router = APIRouter()


@router.get("/", response_model=List[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    """
    Retourne tous les services avec leur dernier statut.
    C'est le endpoint principal appelé par le dashboard.
    """
    services = db.query(Service).filter(
        Service.is_active == True
    ).all()

    result = []
    for service in services:

        # Récupère le dernier check pour ce service
        last_check = db.query(Check).filter(
            Check.service_id == service.id
        ).order_by(Check.checked_at.desc()).first()

        result.append(ServiceOut(
            id=service.id,
            name=service.name,
            url=str(service.url),
            is_active=service.is_active,
            created_at=service.created_at,
            status=last_check.status.value if last_check else "unknown",
            last_check=last_check.checked_at if last_check else None,
            last_response_time_ms=last_check.response_time_ms
                                  if last_check else None,
        ))

    return result


@router.post("/", response_model=ServiceOut)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db)
):
    """
    Ajoute un nouveau service à surveiller.
    """
    # Vérifie que le nom n'existe pas déjà
    existing = db.query(Service).filter(
        Service.name == payload.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Un service nommé '{payload.name}' existe déjà."
        )

    service = Service(
        name=payload.name,
        url=str(payload.url),
    )
    db.add(service)
    db.commit()
    db.refresh(service)

    return ServiceOut(
        id=service.id,
        name=service.name,
        url=str(service.url),
        is_active=service.is_active,
        created_at=service.created_at,
        status="unknown",
    )


@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db)
):
    """
    Désactive un service — on garde l'historique (soft delete).
    """
    service = db.query(Service).filter(
        Service.id == service_id
    ).first()

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service introuvable."
        )

    service.is_active = False
    db.commit()

    return {"message": f"Service '{service.name}' désactivé."}


@router.get("/{service_id}/stats", response_model=ServiceStats)
def get_service_stats(
    service_id: int,
    db: Session = Depends(get_db)
):
    """
    Retourne les statistiques d'uptime d'un service.
    """
    service = db.query(Service).filter(
        Service.id == service_id
    ).first()

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service introuvable."
        )

    checks = db.query(Check).filter(
        Check.service_id == service_id
    ).all()

    total = len(checks)

    if total == 0:
        return ServiceStats(
            service_id=service_id,
            service_name=service.name,
            uptime_percent=0.0,
            avg_response_ms=0.0,
            total_checks=0,
            checks_up=0,
            checks_down=0,
        )

    checks_up = sum(
        1 for c in checks if c.status == ServiceStatus.up
    )
    checks_down = sum(
        1 for c in checks if c.status == ServiceStatus.down
    )
    avg_response = sum(
        c.response_time_ms for c in checks
        if c.response_time_ms
    ) / max(checks_up, 1)

    return ServiceStats(
        service_id=service_id,
        service_name=service.name,
        uptime_percent=round((checks_up / total) * 100, 2),
        avg_response_ms=round(avg_response, 2),
        total_checks=total,
        checks_up=checks_up,
        checks_down=checks_down,
    )