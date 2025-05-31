FROM node:18-bullseye-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    g++ \
    make \
    python2 \
    sqlite3 \
    libsqlite3-dev \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set Python 2 as default (required for node-gyp)
RUN ln -sf /usr/bin/python2 /usr/bin/python

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend

# Install SQLite3 v4.2.0 with specific build flags
RUN npm install sqlite3@4.2.0 --build-from-source --sqlite=/usr --sqlite_libname=sqlite3 --build-from-source

# Install other dependencies
RUN npm install

# Go back to app root
WORKDIR /app

# Copy application code
COPY . .

# Set working directory for the app
WORKDIR /app/backend

# Set environment to production
ENV NODE_ENV=production

# Expose the app port
EXPOSE 3200

# Start the application
CMD ["sh", "-c", "node init-db.js && node server.js"]
