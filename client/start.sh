#!/bin/bash

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

MODE="local"

while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        --local)
            MODE="local"
            ;;
        --deployed)
            MODE="deployed"
            ;;
        *)
            echo "Invalid option: $key"
            echo "Usage: ./start.sh [--local | --deployed]"
            exit 1
            ;;
    esac
    shift
done

ENV_FILE=".env.${MODE}"

if [ ! -f "$ENV_FILE" ]; then
    echo "Environment file '$ENV_FILE' not found."
    exit 1
fi

VITE_BACKEND_URL=$(cat $ENV_FILE | grep VITE_BACKEND_URL | cut -d '=' -f2)
echo "Using API URL: $VITE_BACKEND_URL"

export VITE_API_URL=$VITE_BACKEND_URL

npm run dev
