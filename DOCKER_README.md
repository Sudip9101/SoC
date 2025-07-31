# SoCTeamUp Docker Containerization

This project has been containerized using Docker with separate containers for frontend and backend services.

## 🏗️ Architecture

- **Frontend Container**: Next.js application (Port 3000)
- **Backend Container**: Express server wrapping Lambda functions (Port 3001)
- **Nginx Container**: Reverse proxy for production (Port 80/443)

## 📁 Docker Files

- `Dockerfile.frontend` - Frontend container configuration
- `Dockerfile.backend` - Backend container configuration
- `docker-compose.yml` - Multi-container orchestration
- `nginx.conf` - Nginx reverse proxy configuration
- `.dockerignore` - Files to exclude from Docker builds

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SoC
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Backend Environment Variables
   JWT_SECRET=your-jwt-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   ```

3. **Build and run containers**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Run in detached mode
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🔧 Container Management

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
```

### Stop services
```bash
docker-compose down
```

### Rebuild specific service
```bash
docker-compose build frontend
docker-compose build backend
```

## 🏭 Production Deployment

### With Nginx Reverse Proxy
```bash
# Start with nginx proxy
docker-compose --profile production up -d
```

### Environment Variables for Production
Update the environment variables in `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - JWT_SECRET=your-production-jwt-secret
  - GOOGLE_CLIENT_ID=your-production-google-client-id
  - GOOGLE_CLIENT_SECRET=your-production-google-client-secret
  - AWS_REGION=us-east-1
  - AWS_ACCESS_KEY_ID=your-production-aws-access-key
  - AWS_SECRET_ACCESS_KEY=your-production-aws-secret-key
```

### SSL Configuration
1. Create SSL certificates
2. Mount them to the nginx container
3. Uncomment HTTPS configuration in `nginx.conf`

## 🔍 Health Checks

### Backend Health Check
```bash
curl http://localhost:3001/health
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :3001
   ```

2. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs
   
   # Rebuild containers
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. **Environment variables not loading**
   - Ensure `.env` file exists in root directory
   - Check variable names match docker-compose.yml

### Debug Commands

```bash
# Enter container shell
docker-compose exec frontend sh
docker-compose exec backend sh

# View container resources
docker stats

# Clean up Docker
docker system prune -a
```

## 📊 Monitoring

### Container Metrics
```bash
# Resource usage
docker stats

# Container details
docker inspect <container-name>
```

### Log Monitoring
```bash
# Follow logs in real-time
docker-compose logs -f

# Filter logs
docker-compose logs -f | grep ERROR
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **Network Security**: Use Docker networks for service communication
3. **Image Security**: Regularly update base images
4. **Access Control**: Implement proper authentication and authorization

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale frontend containers
docker-compose up --scale frontend=3

# Scale backend containers
docker-compose up --scale backend=2
```

### Load Balancing
The nginx configuration includes basic load balancing. For production, consider:
- AWS Application Load Balancer
- Kubernetes ingress controllers
- Traefik reverse proxy

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Docker Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker images
        run: |
          docker-compose build
          # Add deployment steps
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `AWS_REGION` | AWS region | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `PORT` | Service port | No (default: 3000/3001) |

## 🤝 Contributing

1. Make changes to the application
2. Test locally with Docker
3. Update Docker configuration if needed
4. Submit pull request

## 📞 Support

For Docker-related issues:
1. Check the troubleshooting section
2. Review container logs
3. Verify environment variables
4. Contact the development team 