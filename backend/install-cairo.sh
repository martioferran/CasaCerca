#!/bin/bash

# Update package lists
apt-get update

# Install essential build tools
apt-get install -y build-essential

# Install cairo, cmake, and pkg-config
apt-get install -y libcairo2-dev cmake pkg-config

# Install other Cairo-related dependencies (if needed)
apt-get install -y libffi-dev libgirepository1.0-dev

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*
