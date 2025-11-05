# Docker Documentation

This document provides instructions for building and running the application using Docker.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose (optional, comes with Docker Desktop)

## Building the Docker Image

### Using Docker

Build the image with the following command:

```bash
docker build -t assessment-cced-unila .
```

### Using Docker Compose

Build the image using Docker Compose:

```bash
docker-compose build
```

## Running the Application

### Using Docker

Run the container:

```bash
docker run -p 3000:3000 assessment-cced-unila
```

Run with environment variables:

```bash
docker run -p 3000:3000 -e NODE_ENV=production assessment-cced-unila
```

Run in detached mode:

```bash
docker run -d -p 3000:3000 --name assessment-app assessment-cced-unila
```

### Using Docker Compose

Start the application:

```bash
docker-compose up
```

Start in detached mode:

```bash
docker-compose up -d
```

Stop the application:

```bash
docker-compose down
```

## Accessing the Application

Once the container is running, access the application at:

```
http://localhost:3000
```

## Docker Image Details

The Dockerfile uses a multi-stage build process:

1. **Dependencies Stage**: Installs all Node.js dependencies
2. **Builder Stage**: Builds the Next.js application
3. **Runner Stage**: Creates a minimal production image with only necessary files

### Image Optimizations

- Uses Alpine Linux base image for smaller size
- Multi-stage build to minimize final image size
- Runs as non-root user for security
- Includes health check for container monitoring
- Standalone output mode for optimal Next.js deployment

## Common Docker Commands

### View running containers

```bash
docker ps
```

### View all containers (including stopped)

```bash
docker ps -a
```

### View container logs

```bash
docker logs assessment-app
```

### Follow container logs (live)

```bash
docker logs -f assessment-app
```

### Stop a running container

```bash
docker stop assessment-app
```

### Remove a container

```bash
docker rm assessment-app
```

### Remove the image

```bash
docker rmi assessment-cced-unila
```

### Access container shell

```bash
docker exec -it assessment-app sh
```

## Environment Variables

You can pass environment variables to the container using the `-e` flag or by creating an `.env` file for Docker Compose.

Example with Docker:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  assessment-cced-unila
```

Example with Docker Compose (add to `docker-compose.yml`):

```yaml
environment:
  - NODE_ENV=production
  - NEXT_TELEMETRY_DISABLED=1
  - YOUR_CUSTOM_VAR=value
```

## Health Check

The Docker Compose configuration includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Retries 3 times before marking as unhealthy
- Waits 40 seconds before starting checks

View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' assessment-app
```

## Troubleshooting

### Container exits immediately

Check the logs:
```bash
docker logs assessment-app
```

### Port already in use

Change the host port mapping:
```bash
docker run -p 8080:3000 assessment-cced-unila
```

### Build fails

1. Clear Docker cache and rebuild:
```bash
docker build --no-cache -t assessment-cced-unila .
```

2. Check if all required files are present
3. Verify Node.js version compatibility

### Container runs but app is not accessible

1. Verify the container is running:
```bash
docker ps
```

2. Check if the port is correctly mapped:
```bash
docker port assessment-app
```

3. Check container logs for errors:
```bash
docker logs assessment-app
```

## Production Deployment

For production deployment:

1. Build the image with a version tag:
```bash
docker build -t assessment-cced-unila:1.0.0 .
```

2. Tag for your registry:
```bash
docker tag assessment-cced-unila:1.0.0 your-registry.com/assessment-cced-unila:1.0.0
```

3. Push to registry:
```bash
docker push your-registry.com/assessment-cced-unila:1.0.0
```

4. Deploy to your container orchestration platform (Kubernetes, Docker Swarm, etc.)

## Performance Considerations

- The image uses Node.js 20 Alpine for optimal performance and size
- Standalone output mode reduces the final image size
- Multi-stage build ensures only production dependencies are included
- Application runs as non-root user for enhanced security

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js with Docker](https://nextjs.org/docs/deployment#docker-image)