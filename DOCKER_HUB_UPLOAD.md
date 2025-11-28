# Docker Hub Upload Guide for SocTeamUp

This guide will help you build and upload your SocTeamUp application images to Docker Hub.

## Prerequisites

1. **Docker Desktop installed and running**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure Docker Desktop is running before proceeding

2. **Docker Hub account**
   - Create account at: https://hub.docker.com/
   - Remember your username

## Method 1: Automated Script (Recommended)

### Step 1: Run the PowerShell Script
```powershell
# Replace 'your-dockerhub-username' with your actual Docker Hub username
.\build-and-push-dockerhub.ps1 -DockerHubUsername "your-dockerhub-username"

# Or with a specific tag
.\build-and-push-dockerhub.ps1 -DockerHubUsername "your-dockerhub-username" -Tag "v1.0"
```

The script will:
- ✅ Check if Docker is available
- 🔐 Prompt you to login to Docker Hub
- 🏗️ Build both frontend and backend images
- 📤 Push images to Docker Hub
- 📝 Create `docker-compose-hub.yml` for deployment

## Method 2: Manual Commands

### Step 1: Login to Docker Hub
```bash
docker login
```
Enter your Docker Hub username and password when prompted.

### Step 2: Build Images
```bash
# Build frontend image
docker build -f Dockerfile.frontend -t your-username/socteamup-frontend:latest .

# Build backend image  
docker build -f Dockerfile.backend -t your-username/socteamup-backend:latest .
```

### Step 3: Push Images to Docker Hub
```bash
# Push frontend image
docker push your-username/socteamup-frontend:latest

# Push backend image
docker push your-username/socteamup-backend:latest
```

## Verification

After uploading, you can verify your images are on Docker Hub:

1. Go to: https://hub.docker.com/u/your-username
2. You should see:
   - `your-username/socteamup-frontend`
   - `your-username/socteamup-backend`

## Using Docker Hub Images

### Option 1: Use the generated docker-compose-hub.yml
```bash
docker-compose -f docker-compose-hub.yml up
```

### Option 2: Update your existing docker-compose.yml
Replace the `build` sections with `image` sections:

```yaml
services:
  frontend:
    image: your-username/socteamup-frontend:latest
    # Remove the build section
    ports:
      - "3000:3000"
    # ... rest of config

  backend:
    image: your-username/socteamup-backend:latest
    # Remove the build section  
    ports:
      - "3001:3001"
    # ... rest of config
```

## Sharing Your Application

Once uploaded to Docker Hub, others can run your application with:

```bash
# Clone your repository (if they need the docker-compose file)
git clone your-repository-url
cd your-repository

# Run using Docker Hub images
docker-compose -f docker-compose-hub.yml up
```

Or create a minimal docker-compose.yml with just your Docker Hub images.

## Troubleshooting

### Docker not found
- Make sure Docker Desktop is installed and running
- Restart your terminal/PowerShell after installing Docker Desktop
- Check if Docker is in your PATH

### Login issues
- Verify your Docker Hub username and password
- Use `docker logout` and then `docker login` again

### Build failures
- Check that all files are present in the build context
- Ensure Dockerfiles are correctly formatted
- Check Docker Desktop has enough resources (memory/disk space)

### Push failures
- Verify you're logged into Docker Hub
- Check your internet connection
- Ensure the repository name matches your Docker Hub username

## Image Information

**Frontend Image:**
- Base: `node:18-alpine`
- Port: 3000
- Contains: Next.js application with optimized production build

**Backend Image:**
- Base: `node:18-alpine` 
- Port: 3001
- Contains: Express server with Lambda function handlers

## Security Notes

- Never include sensitive environment variables in Docker images
- Use `.dockerignore` to exclude sensitive files
- Consider using multi-stage builds for smaller production images
- Regularly update base images for security patches

## Next Steps

After uploading to Docker Hub:
1. 🔄 Set up automated builds (optional)
2. 🏷️ Use semantic versioning for your tags
3. 📚 Update your README with Docker Hub instructions
4. 🚀 Deploy to cloud platforms using your Docker Hub images 