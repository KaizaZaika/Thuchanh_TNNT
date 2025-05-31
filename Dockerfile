# Use Node.js as the base image
FROM node:16

# Install Python and required dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-opencv \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./backend/

# Install Node.js dependencies
WORKDIR /app/backend
RUN npm install

# Install Python dependencies for product recognition
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy application code
WORKDIR /app
COPY . .

# Expose the port the app runs on
EXPOSE 3200

# Command to run the application
CMD ["node", "backend/server.js"]
