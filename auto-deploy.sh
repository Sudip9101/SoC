#!/bin/bash

echo "========================================"
echo "  SoCTeamUp Auto-Deployment Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use: sudo ./auto-deploy.sh)${NC}"
   exit 1
fi

# Step 1: Stop existing containers
echo -e "${YELLOW}Step 1: Stopping existing containers...${NC}"
cd /root/website || { echo "Directory /root/website not found!"; exit 1; }
docker-compose down 2>/dev/null || true
docker stop backend frontend mysql 2>/dev/null || true
docker rm backend frontend mysql 2>/dev/null || true
echo -e "${GREEN}✅ Stopped existing containers${NC}"
echo ""

# Step 2: Backup old config
echo -e "${YELLOW}Step 2: Backing up old configuration...${NC}"
if [ -f "docker-compose.yml" ]; then
    cp docker-compose.yml "docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ Backed up old docker-compose.yml${NC}"
else
    echo -e "${CYAN}No previous docker-compose.yml found${NC}"
fi
echo ""

# Step 3: Create new docker-compose.yml
echo -e "${YELLOW}Step 3: Creating new docker-compose.yml...${NC}"
cat > docker-compose.yml << 'EOF'
version: "3.9"

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: socteamup_db
      MYSQL_USER: socteamup_user
      MYSQL_PASSWORD: socteamup_password
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - socnet
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot_password"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

  # Backend Service
  backend:
    image: rackssudip/socteamup-backend:latest
    container_name: backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: socteamup_db
      DB_USER: socteamup_user
      DB_PASSWORD: socteamup_password
      SMTP_ENABLED: "true"
      SMTP_HOST: smtp.gmail.com
      SMTP_PORT: 587
      SMTP_SECURE: "false"
      SMTP_USER: socteamup28@gmail.com
      SMTP_PASS: cppmefbeqhzonknf
      SMTP_FROM: socteamup28@gmail.com
      SMTP_TO: socteamup28@gmail.com
      JWT_SECRET: your-jwt-secret-change-in-production
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - socnet
    restart: unless-stopped

  # Frontend Service
  frontend:
    image: rackssudip/socteamup-frontend:latest
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend
    networks:
      - socnet
    restart: unless-stopped

networks:
  socnet:
    driver: bridge

volumes:
  mysql_data:
    driver: local
EOF

echo -e "${GREEN}✅ Created new docker-compose.yml${NC}"
echo ""

# Step 4: Pull latest images
echo -e "${YELLOW}Step 4: Pulling Docker images...${NC}"
docker pull mysql:8.0
docker pull rackssudip/socteamup-backend:latest
docker pull rackssudip/socteamup-frontend:latest
echo -e "${GREEN}✅ Images pulled${NC}"
echo ""

# Step 5: Start services
echo -e "${YELLOW}Step 5: Starting services...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Step 6: Wait for services to initialize
echo -e "${YELLOW}Step 6: Waiting for services to initialize...${NC}"
echo -e "${CYAN}This may take 30-60 seconds...${NC}"
sleep 10

# Wait for MySQL to be healthy
echo -ne "${CYAN}Waiting for MySQL..."
for i in {1..60}; do
    if docker exec mysql mysqladmin ping -h localhost -u root -proot_password --silent 2>/dev/null; then
        echo -e " ${GREEN}✅ MySQL is ready!${NC}"
        break
    fi
    echo -ne "."
    sleep 1
done
echo ""

# Wait a bit more for backend to connect
sleep 10

# Step 7: Verify deployment
echo ""
echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"
echo ""

# Check containers
echo -e "${CYAN}Container Status:${NC}"
docker-compose ps
echo ""

# Check backend logs
echo -e "${CYAN}Backend Logs (last 15 lines):${NC}"
docker-compose logs backend --tail 15
echo ""

# Test backend health
echo -e "${CYAN}Testing Backend Health:${NC}"
sleep 5
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health 2>/dev/null || echo "Connection failed")
echo "$HEALTH_RESPONSE"
echo ""

# Step 8: Display access information
echo ""
echo "========================================"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo "========================================"
echo ""
echo -e "${CYAN}Access Points:${NC}"
echo -e "  Frontend:  ${GREEN}http://$(hostname -I | awk '{print $1}'):3000${NC}"
echo -e "  Backend:   ${GREEN}http://$(hostname -I | awk '{print $1}'):3001${NC}"
echo -e "  Health:    ${GREEN}http://$(hostname -I | awk '{print $1}'):3001/health${NC}"
echo ""
echo -e "${CYAN}Management Commands:${NC}"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo "  Status:       docker-compose ps"
echo ""

# Step 9: Final verification
echo -e "${YELLOW}Final Verification:${NC}"

# Check if all containers are running
MYSQL_STATUS=$(docker inspect -f '{{.State.Status}}' mysql 2>/dev/null)
BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' backend 2>/dev/null)
FRONTEND_STATUS=$(docker inspect -f '{{.State.Status}}' frontend 2>/dev/null)

if [ "$MYSQL_STATUS" = "running" ] && [ "$BACKEND_STATUS" = "running" ] && [ "$FRONTEND_STATUS" = "running" ]; then
    echo -e "${GREEN}✅ All services are running!${NC}"
    
    # Check if backend is healthy
    if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        
        if echo "$HEALTH_RESPONSE" | grep -q '"database":"connected"'; then
            echo -e "${GREEN}✅ Database is connected!${NC}"
        else
            echo -e "${RED}❌ Database not connected yet (may need more time)${NC}"
        fi
        
        if echo "$HEALTH_RESPONSE" | grep -q '"email":"enabled"'; then
            echo -e "${GREEN}✅ Email is enabled!${NC}"
        else
            echo -e "${YELLOW}⚠️  Email not enabled${NC}"
        fi
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        echo -e "${YELLOW}Check logs: docker-compose logs backend${NC}"
    fi
else
    echo -e "${RED}❌ Some services failed to start${NC}"
    echo ""
    echo -e "${YELLOW}Container Status:${NC}"
    echo "  MySQL:    $MYSQL_STATUS"
    echo "  Backend:  $BACKEND_STATUS"
    echo "  Frontend: $FRONTEND_STATUS"
    echo ""
    echo -e "${YELLOW}Check logs with: docker-compose logs${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Setup Complete! Open browser to:${NC}"
echo -e "${GREEN}http://$(hostname -I | awk '{print $1}'):3000${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""



