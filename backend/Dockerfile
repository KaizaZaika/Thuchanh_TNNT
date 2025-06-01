FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    git \
    build-essential \
    pkg-config \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

WORKDIR /app

COPY backend/package*.json ./backend/

RUN npm install --prefix ./backend

COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY data/ ./data/


RUN pip3 install --no-cache-dir -r backend/requirements.txt --break-system-packages

EXPOSE 3200

CMD ["node", "backend/server.js"]