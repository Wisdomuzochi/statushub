import httpx
import time
from celery import Celery
from celery.schedules import crontab
from datetime import datetime
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models import Service, Check, ServiceStatus

# ── Création de l'app Celery ─────────────────────────────────
celery_app = Celery(
    "statushub",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

# ── Configuration ────────────────────────────────────────────
celery_app.conf.update(
    timezone="Europe/Paris",
    enable_utc=True,

    # Lance le check toutes les 30 secondes
    beat_schedule={
        "check-all-services": {
            "task": "worker.tasks.check_all_services",
            "schedule": settings.check_interval,
        },
    },
)


# ── Tâche principale ─────────────────────────────────────────
@celery_app.task(name="worker.tasks.check_all_services")
def check_all_services():
    """
    Récupère tous les services actifs
    et ping chacun d'eux.
    Appelée automatiquement toutes les 30 secondes
    par Celery Beat.
    """
    db: Session = SessionLocal()

    try:
        services = db.query(Service).filter(
            Service.is_active == True
        ).all()

        for service in services:
            check_single_service.delay(service.id, service.url)

    finally:
        db.close()


@celery_app.task(name="worker.tasks.check_single_service")
def check_single_service(service_id: int, url: str):
    """
    Ping une URL et enregistre le résultat en base.

    → Si la réponse est < 400 : UP
    → Si la réponse est >= 400 : DOWN
    → Si timeout ou erreur réseau : DOWN
    """
    db: Session = SessionLocal()

    try:
        start = time.time()

        try:
            response = httpx.get(
                url,
                timeout=10.0,
                follow_redirects=True,
            )
            elapsed_ms = (time.time() - start) * 1000

            # Statut selon le code HTTP
            if response.status_code < 400:
                status = ServiceStatus.up
            else:
                status = ServiceStatus.down

            check = Check(
                service_id=service_id,
                status=status,
                response_time_ms=round(elapsed_ms, 2),
                status_code=response.status_code,
                error_message=None,
                checked_at=datetime.utcnow(),
            )

        except httpx.TimeoutException:
            check = Check(
                service_id=service_id,
                status=ServiceStatus.down,
                response_time_ms=None,
                status_code=None,
                error_message="Timeout — pas de réponse après 10s",
                checked_at=datetime.utcnow(),
            )

        except httpx.RequestError as e:
            check = Check(
                service_id=service_id,
                status=ServiceStatus.down,
                response_time_ms=None,
                status_code=None,
                error_message=f"Erreur réseau : {str(e)[:200]}",
                checked_at=datetime.utcnow(),
            )

        db.add(check)
        db.commit()

    finally:
        db.close()