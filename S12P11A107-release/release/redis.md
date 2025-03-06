## Use docker-compose
```yml
version: '3.8'

services:
  redis:
    image: redis:7.2.3
    container_name: redis
    ports:
      - "8025:6379"  # Exposes Redis on port 6379
    volumes:
      - redis_data:/data  # Persist Redis data in a Docker volume
    restart: always  # Ensures the Redis container restarts if it stops unexpectedly

volumes:
  redis_data:
```

## Run
```docker-compose up -d```