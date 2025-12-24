# Docker Web Manager

A web application to manage local and network Docker containers, images, volumes, and networks. Built with Node.js, TypeScript, React, and Bulma CSS.

## Features

- **Dashboard**: Overview of Docker resources (containers, images, volumes)
- **Container Management**: Start, stop, restart, and remove containers
- **Image Management**: View, pull, and remove Docker images
- **Volume Management**: List and remove Docker volumes
- **Network Management**: View and remove Docker networks
- **Settings**: Configure application settings stored in SQLite

## Technology Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Docker Engine API** for Docker operations
- **JSON file storage** for settings and configuration
- **Object-Oriented Programming** with clean architecture (Services, Controllers, Routes)

### Frontend
- **React** with **TypeScript**
- **React Router** for multi-page routing
- **Bulma CSS** for styling
- **Axios** for API communication

### Infrastructure
- **Multi-stage Dockerfile** (build + Nginx production stage)
- **Webpack** for client bundling
- **Jest** for testing

## Project Structure

```
docker_web_manager/
├── src/
│   ├── server/
│   │   ├── controllers/        # Express route controllers
│   │   ├── services/           # Business logic layer
│   │   ├── routes/             # Express routes
│   │   ├── docker/             # Docker API client
│   │   ├── database/           # SQLite database manager
│   │   └── index.ts            # Server entry point
│   └── client/
│       ├── api/                # API client
│       ├── components/         # React components
│       ├── pages/              # React page components
│       ├── styles/             # CSS files
│       ├── App.tsx             # Main React component
│       └── index.tsx           # Client entry point
├── dist/                       # Compiled output
├── scripts/                    # Build and test scripts
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose configuration
├── nginx.conf                  # Nginx configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack configuration
└── README.md                   # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** (for running the app in a container or managing containers)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd docker_web_manager
```

### 2. Install dependencies

```bash
npm install
```

## Development

### Run in development mode

Start both the server and client with hot-reload:

```bash
npm run dev
```

- **Backend**: http://localhost:3000
- **Frontend Dev Server**: http://localhost:3001

### Run server only

```bash
npm run dev:server
```

### Run client only

```bash
npm run dev:client
```

## Building

### Build for production

```bash
npm run build
```

Or use the build script:

```bash
chmod +x scripts/build.sh
./scripts/build.sh
```

This will:
- Compile TypeScript server code to `dist/server/`
- Bundle React client code to `dist/client/`

### Run production build

```bash
npm start
```

The application will be available at http://localhost:3000

## Testing

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run linter

```bash
npm run lint
```

### Run all checks (lint + test)

```bash
chmod +x scripts/test.sh
./scripts/test.sh
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

The application will be available at http://localhost:8080

### Using Dockerfile directly

#### Build the image

```bash
docker build -t docker-web-manager .
```

#### Run the container

```bash
docker run -d \
  -p 8080:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/data:/app/data \
  docker-web-manager
```

**Note**: The `-v /var/run/docker.sock:/var/run/docker.sock` mount is required to allow the application to communicate with the Docker daemon.

### Stop the container

```bash
docker-compose down
```

## Configuration

Application settings are stored in JSON file at `data/settings.json`. You can modify settings through the Settings page in the web UI or edit the JSON file directly.

Default settings:
- `docker_socket`: `/var/run/docker.sock`
- `refresh_interval`: `5000` (ms)
- `theme`: `light`

## Architecture

The application follows **Object-Oriented Programming** principles with clear separation of concerns:

1. **Docker Client** (`DockerClient.ts`): Communicates with Docker Engine API
2. **Services** (`services/`): Business logic for each resource type
3. **Controllers** (`controllers/`): Handle HTTP requests and responses
4. **Routes** (`routes/`): Define API endpoints
5. **Database Manager** (`DatabaseManager.ts`): Manage SQLite operations

Each class/module is in a separate file, and related files are grouped in folders.

## API Endpoints

### Containers
- `GET /api/containers` - List all containers
- `GET /api/containers/:id` - Inspect container
- `POST /api/containers/:id/start` - Start container
- `POST /api/containers/:id/stop` - Stop container
- `POST /api/containers/:id/restart` - Restart container
- `DELETE /api/containers/:id` - Remove container

### Images
- `GET /api/images` - List all images
- `GET /api/images/:id` - Inspect image
- `POST /api/images/pull` - Pull image
- `POST /api/images/:id/tag` - Tag image
- `DELETE /api/images/:id` - Remove image

### Volumes
- `GET /api/volumes` - List all volumes
- `GET /api/volumes/:name` - Inspect volume
- `DELETE /api/volumes/:name` - Remove volume

### Networks
- `GET /api/networks` - List all networks
- `GET /api/networks/:id` - Inspect network
- `DELETE /api/networks/:id` - Remove network

### Settings
- `GET /api/settings` - List all settings
- `GET /api/settings/:key` - Get setting by key
- `PUT /api/settings/:key` - Update setting
- `DELETE /api/settings/:key` - Delete setting

## Troubleshooting

### Cannot connect to Docker daemon

Ensure the Docker socket is accessible:
```bash
ls -la /var/run/docker.sock
```

If running in Docker, make sure the socket is mounted:
```bash
-v /var/run/docker.sock:/var/run/docker.sock
```

### Permission denied on Docker socket

Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
```

Then log out and log back in.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
