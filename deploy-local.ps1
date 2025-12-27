# ============================================
# PayFlow - Local Deployment Script
# ============================================
# Usage: .\deploy-local.ps1
# 
# This script pulls the latest images from GHCR
# and restarts all containers.
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PayFlow - Local Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Pulling latest images from GHCR..." -ForegroundColor Yellow
docker-compose pull

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to pull images. Check your GHCR authentication." -ForegroundColor Red
    Write-Host "   Run: docker login ghcr.io -u YOUR_USERNAME" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "🚀 Restarting containers with new images..." -ForegroundColor Yellow
docker-compose up -d --force-recreate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start containers." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "   🌐 Access the app at: http://localhost:8000" -ForegroundColor White
Write-Host ""

