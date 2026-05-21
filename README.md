# Hamro AI — P2P GPU Marketplace

A platform where laptop owners can rent out their GPUs for AI/ML workloads. Built with React, Node.js, and Docker.

## Features

- P2P GPU rental marketplace
- Production Docker + Nginx reverse proxy setup
- Background email queue with Bull + Redis
- Redis rate-limiter and health checks
- cPanel deployment support

## Quick Start

```bash
# Copy environment config
cp .env.example .env

# Start with Docker
docker compose up -d

# Or run locally
npm install
npm run dev
```

## Deployment

See `.env.cpanel` for cPanel deployment configuration. The project includes full Docker support with Nginx reverse proxy.

## License

MIT
