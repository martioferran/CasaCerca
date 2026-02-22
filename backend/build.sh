#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add Cargo to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Upgrade pip
pip install -U pip
