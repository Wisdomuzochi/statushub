FROM python:3.11-slim

WORKDIR /app

# Copie les dépendances en premier
# pour profiter du cache Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie le reste du code
COPY . .