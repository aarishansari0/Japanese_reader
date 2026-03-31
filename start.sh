#!/bin/bash

echo "Starting server..."

node server.js &

sleep 2

echo "Opening browser..."
xdg-open http://localhost:8000/open-file.html