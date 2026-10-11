#!/usr/bin/env bash
# Avvia Docker e lo stack Supabase locale nelle sessioni cloud di Claude Code
# (macchina pulita a ogni sessione). In locale basta `pnpm db:start`.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! docker info >/dev/null 2>&1; then
  echo "Avvio del demone Docker..."
  nohup dockerd >/tmp/dockerd.log 2>&1 &
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 1
  done
  docker info >/dev/null 2>&1 || { echo "Docker non parte: vedi /tmp/dockerd.log" >&2; exit 1; }
fi

# Le immagini Supabase si scaricano da Docker Hub: il registro predefinito
# (AWS ECR) è bloccato dal proxy delle sessioni cloud.
SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io \
  pnpm exec supabase start -x imgproxy,vector,logflare,supavisor,edge-runtime

pnpm exec supabase status -o env | grep -E '^(API_URL|DB_URL|PUBLISHABLE_KEY|ANON_KEY)=' || true
