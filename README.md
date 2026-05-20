# 🟢 StatusHub

> Plateforme de monitoring d'uptime en temps réel.
> Surveille la disponibilité et la latence de tes services web.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Docker](https://img.shields.io/badge/docker-compose-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![CI](https://github.com/Wisdomuzochi/statushub/actions/workflows/ci.yml/badge.svg)

---

## 📌 C'est quoi ?

StatusHub vérifie toutes les 30 secondes si tes URLs répondent.
Un dashboard live affiche en temps réel :

- 🟢 **UP** — le service répond normalement
- 🔴 **DOWN** — timeout ou erreur réseau
- ⏱️ **Latence** en millisecondes
- 📈 **Historique** des vérifications

---

## 🏗️ Architecture

┌─────────────────────────────────────────────────────┐
│                   React Dashboard                   │
│              (dashboard live, 30s refresh)          │
└─────────────────────────┬───────────────────────────┘
│ HTTP
┌─────────────────────────▼───────────────────────────┐
│                   FastAPI Backend                   │
│         GET /api/services   POST /api/services      │
└──────────┬──────────────────────────────────────────┘
│
┌──────────▼──────────┐     ┌─────────────────────────┐
│   Celery Beat       │────▶│   Celery Worker         │
│  (toutes les 30s)   │     │  (ping chaque URL)      │
└─────────────────────┘     └──────────┬──────────────┘
│
┌────────────────────────▼────────────────┐
│              PostgreSQL                  │
│   Table services  │  Table checks        │
└──────────────────────────────────────────┘
│
┌─────────▼────────┐
│      Redis        │
│  (broker Celery)  │
└──────────────────┘

---

## 🛠️ Stack technique

| Couche          | Technologie                  |
|-----------------|------------------------------|
| Backend         | FastAPI (Python)             |
| Worker          | Celery + Redis               |
| Base de données | PostgreSQL                   |
| Frontend        | React + Recharts             |
| HTTP Client     | httpx                        |
| Conteneurs      | Docker + Docker Compose      |
| CI/CD           | GitHub Actions               |
| Tests           | pytest                       |

---

## 🚀 Lancement en local

### Prérequis

- Docker et Docker Compose installés
- Git

### Installation

```bash
# Clone le repo
git clone https://github.com/Wisdomuzochi/statushub.git
cd statushub

# Configure les variables d'environnement
cp .env.example .env

# Lance tous les services
docker compose up --build
```

### Accès

| Service       | URL                         |
|---------------|-----------------------------|
| Dashboard     | http://localhost:5173       |
| API           | http://localhost:8000       |
| Documentation | http://localhost:8000/docs  |

---

## 📡 Endpoints API

GET    /api/services/            → liste tous les services
POST   /api/services/            → ajoute un service
DELETE /api/services/{id}        → supprime un service
GET    /api/services/{id}/stats  → statistiques uptime
GET    /api/checks/{service_id}  → historique des checks
GET    /health                   → health check

---

## 📁 Structure du projet

statushub/
├── backend/
│   ├── app/
│   │   ├── main.py          ← point d'entrée FastAPI
│   │   ├── config.py        ← configuration
│   │   ├── database.py      ← connexion PostgreSQL
│   │   ├── models.py        ← tables SQL
│   │   ├── schemas.py       ← validation Pydantic
│   │   └── api/routes/
│   │       ├── services.py  ← CRUD services
│   │       └── checks.py    ← historique checks
│   ├── worker/
│   │   └── tasks.py         ← Celery worker (ping URLs)
│   ├── tests/
│   │   ├── conftest.py      ← fixtures pytest
│   │   └── test_api.py      ← tests automatiques
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── Header.jsx
│           ├── StatsBar.jsx
│           ├── ServiceCard.jsx
│           └── AddService.jsx
├── .github/
│   └── workflows/
│       └── ci.yml           ← pipeline CI/CD
├── docker-compose.yml
├── .env.example
└── README.md

---

## ⚙️ Variables d'environnement

```env
POSTGRES_USER=statushub_user
POSTGRES_PASSWORD=statushub_secret
POSTGRES_DB=statushub_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
REDIS_URL=redis://redis:6379/0
CHECK_INTERVAL=30
```

---

## 🔄 CI/CD Pipeline

Pipeline GitHub Actions déclenché à chaque push sur `main` :
push → tests pytest → build Docker image

Les tests vérifient :
- Health check de l'API
- Création d'un service
- Détection des doublons
- Listing des services

---

## 👤 Auteur

**MUONAKA Wisdom** — Étudiant Ingénieur ISTY Paris-Saclay
[github.com/Wisdomuzochi](https://github.com/Wisdomuzochi) ·
[wisdomuzochi.github.io](https://wisdomuzochi.github.io)

