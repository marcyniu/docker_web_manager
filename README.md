# Docker Web Manager

A modern web application to manage local and network Docker containers, images, volumes, and networks. Built with Node.js 25, TypeScript, React, and Tailwind CSS.

## Features

- **Dashboard**: Beautiful overview of Docker resources with gradient stats cards
- **Container Management**: Start, stop, restart, and remove containers with visual status indicators
- **Image Management**: View, pull, and remove Docker images with real-time feedback
- **Volume Management**: List and remove Docker volumes with modern UI
- **Network Management**: View and remove Docker networks with enhanced visibility
- **Settings**: Configure application settings with dark/light mode toggle
- **Dark Mode**: Full dark mode support with smooth transitions
- **Modern UI**: Built with Tailwind CSS featuring gradients, shadows, and animations
- **Icons**: Beautiful Feather icons throughout the interface

## Technology Stack

### Backend
- **Node.js 25** with **TypeScript 5.7**
- **Express.js 4.21** for REST API
- **Docker Engine API** for Docker operations
- **JSON file storage** for settings and configuration
- **Object-Oriented Programming** with clean architecture (Services, Controllers, Routes)

### Frontend
- **React 18.3** with **TypeScript**
- **React Router 7.1** for multi-page routing
- **Tailwind CSS 3.4** for modern, responsive styling
- **React Icons 5.4** (Feather Icons) for beautiful iconography
- **Axios 1.7** for API communication
- **Dark Mode** with Context API and localStorage persistence

### Infrastructure
- **Multi-stage Dockerfile** (build + Nginx production stage)
- **Webpack 5.97** with PostCSS for client bundling
- **Jest 29.7** for testing

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
│       ├── context/            # React context (Theme)
│       ├── pages/              # React page components
│       ├── styles/             # Tailwind CSS files
│       ├── App.tsx             # Main React component
│       └── index.tsx           # Client entry point
├── dist/                       # Compiled output
├── scripts/                    # Build and test scripts
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose configuration
├── nginx.conf                  # Nginx configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack configuration
└── README.md                   # This file
```

## Prerequisites

- **Node.js** (v25 or higher)
- **npm** (v10 or higher)
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

- **Backend API**: http://localhost:3000/api
- **Frontend Dev Server**: http://localhost:3001 (webpack dev server with hot reload)
- **Full App**: http://localhost:3001 (recommended for development)

**Note**: In development mode, use http://localhost:3001 to see the app with hot module replacement. The port 3000 serves only the API and won't have the latest client code.

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
- Bundle React client code with Tailwind CSS to `dist/client/`

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

The application will be available at http://localhost:80

### Stop the container

```bash
docker-compose down
```

### Using Dockerfile directly

#### Build the image

```bash
docker build -t docker-web-manager .
```

#### Run the container

```bash
docker run -d \
  --net dev-net \
  --restart=always \
  --name docker_web_manager_app \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  docker-web-manager
```

**Note**: The `-v /var/run/docker.sock:/var/run/docker.sock` mount is required to allow the application to communicate with the Docker daemon.

### Stop and remove the container

```bash
docker stop docker_web_manager_app
docker rm docker_web_manager_app
```

## Configuration

Application settings are stored in JSON file at `data/settings.json`. You can modify settings through the Settings page in the web UI or edit the JSON file directly.

The dark/light mode preference is stored in the browser's localStorage and persists across sessions.

## UI Features

### Dark Mode
Toggle between light and dark themes using the switch in the Settings page. The preference is saved automatically.

### Modern Design Elements
- **Gradient stats cards** on the dashboard
- **Smooth animations** and hover effects
- **Status badges** with color coding (running, stopped, paused)
- **Icon buttons** with tooltips
- **Responsive tables** with hover states
- **Loading spinners** for async operations
- **Empty states** with helpful messages

### Color Palette
The application uses a professional blue-based color scheme that works beautifully in both light and dark modes.

## Architecture

The application follows **Object-Oriented Programming** principles with clear separation of concerns:

1. **Docker Client** (`DockerClient.ts`): Communicates with Docker Engine API
2. **Services** (`services/`): Business logic for each resource type
3. **Controllers** (`controllers/`): Handle HTTP requests and responses
4. **Routes** (`routes/`): Define API endpoints
5. **Database Manager** (`DatabaseManager.ts`): Manage SQLite operations
6. **Theme Context** (`ThemeContext.tsx`): Global dark mode state management

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

### Port 3001 already in use (EADDRINUSE)

If you see `Error: listen EADDRINUSE: address already in use :::3001`, a previous webpack dev server is still running. Kill it with:

```bash
pkill -f webpack
```

Or find and kill the specific process:
```bash
lsof -ti:3001 | xargs kill -9
```

### Blank page when accessing http://localhost:3000 directly

In development mode (`npm run dev`), always use http://localhost:3001 for the full application with hot reload. Port 3000 only serves the API endpoints.

For production:
1. Build first: `npm run build`
2. Then run: `npm start`
3. Access: http://localhost:3000

### Tailwind CSS not showing after Docker build

This issue has been fixed! The webpack configuration now properly extracts CSS for production builds using `mini-css-extract-plugin`. The CSS is included in a separate `styles.[hash].css` file that's automatically linked in the HTML.

Verify the build includes CSS:
```bash
npm run build
ls -lh dist/client/styles.*.css
```

You should see a ~40KB CSS file.

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

## Recent Updates (December 2025)

- ✨ Upgraded to Node.js 25
- 🎨 Migrated from Bulma to Tailwind CSS 3.4
- 🌙 Added full dark mode support with toggle
- 🎯 Added beautiful Feather icons throughout the UI
- 📦 Updated all dependencies to latest versions
- 💅 Redesigned all pages with modern gradients and animations
- ⚡ Improved loading states and empty states
- 🎭 Added smooth transitions and hover effects

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

