#!/bin/bash

echo "Running linter..."
npm run lint

echo ""
echo "Running tests..."
npm test

echo ""
echo "Build successful!"
