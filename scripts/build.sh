#!/bin/bash

echo "Building application..."

# Clean dist folder
rm -rf dist

# Build server
echo "Building server..."
npm run build:server

# Build client
echo "Building client..."
npm run build:client

echo ""
echo "Build completed successfully!"
echo "Server output: dist/server/"
echo "Client output: dist/client/"
