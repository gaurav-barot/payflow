# ============================================
# PayFlow Kubernetes Deployment Script
# ============================================
# Usage:
#   ./deploy-k8s.ps1 -Environment dev     # Deploy to local Docker Desktop K8s
#   ./deploy-k8s.ps1 -Environment prod    # Deploy to AWS (requires SSH access)
#   ./deploy-k8s.ps1 -RolloutOnly         # Only restart pods (pull new images)
# ============================================

param(
    [Parameter()]
    [ValidateSet("dev", "prod")]
    [string]$Environment = "dev",
    
    [Parameter()]
    [switch]$RolloutOnly,
    
    [Parameter()]
    [switch]$SkipInfra,
    
    [Parameter()]
    [string]$Namespace = "payflow"
)

# Colors for output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "============================================" -ForegroundColor Blue
Write-Host "   PayFlow Kubernetes Deployment" -ForegroundColor Blue
Write-Host "============================================" -ForegroundColor Blue
Write-Host ""

# Check kubectl is available
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Error "kubectl is not installed or not in PATH"
    exit 1
}

# Check cluster connection
Write-Info "Checking Kubernetes cluster connection..."
try {
    kubectl cluster-info | Out-Null
    Write-Success "Connected to Kubernetes cluster"
} catch {
    Write-Error "Cannot connect to Kubernetes cluster. Make sure Docker Desktop Kubernetes is running."
    exit 1
}

# Show current context
$currentContext = kubectl config current-context
Write-Info "Current context: $currentContext"

if ($Environment -eq "dev" -and $currentContext -ne "docker-desktop") {
    Write-Warning "Expected 'docker-desktop' context for dev environment, but got '$currentContext'"
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne "y") { exit 0 }
}

# If RolloutOnly, skip applying manifests
if ($RolloutOnly) {
    Write-Info "Rollout-only mode: Restarting all deployments to pull new images..."
    
    $deployments = @(
        "frontend",
        "api-gateway",
        "account-service",
        "transaction-service",
        "notification-service"
    )
    
    foreach ($deployment in $deployments) {
        Write-Info "Restarting $deployment..."
        kubectl rollout restart deployment/$deployment -n $Namespace
    }
    
    Write-Info "Waiting for rollouts to complete..."
    foreach ($deployment in $deployments) {
        Write-Info "Waiting for $deployment..."
        kubectl rollout status deployment/$deployment -n $Namespace --timeout=120s
    }
    
    Write-Success "All deployments restarted successfully!"
    kubectl get pods -n $Namespace
    exit 0
}

# Full deployment
Write-Info "Starting full deployment to $Environment environment..."

# Step 1: Apply namespace
Write-Info "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Step 2: Apply ConfigMaps and Secrets
Write-Info "Applying ConfigMaps and Secrets..."
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/

# Step 3: Apply infrastructure (unless skipped)
if (-not $SkipInfra) {
    Write-Info "Deploying infrastructure (PostgreSQL, Kafka)..."
    kubectl apply -f k8s/deployments/postgres.yaml
    kubectl apply -f k8s/services/postgres-svc.yaml
    kubectl apply -f k8s/deployments/kafka.yaml
    kubectl apply -f k8s/services/kafka-svc.yaml
    
    # Wait for infrastructure to be ready
    Write-Info "Waiting for PostgreSQL to be ready..."
    kubectl rollout status deployment/postgres -n $Namespace --timeout=120s
    
    Write-Info "Waiting for Kafka to be ready..."
    kubectl rollout status deployment/kafka -n $Namespace --timeout=180s
}

# Step 4: Apply application deployments
Write-Info "Deploying application services..."
kubectl apply -f k8s/deployments/account-service.yaml
kubectl apply -f k8s/deployments/transaction-service.yaml
kubectl apply -f k8s/deployments/notification-service.yaml
kubectl apply -f k8s/deployments/api-gateway.yaml
kubectl apply -f k8s/deployments/frontend.yaml

# Step 5: Apply services
Write-Info "Applying Kubernetes services..."
kubectl apply -f k8s/services/account-service-svc.yaml
kubectl apply -f k8s/services/transaction-service-svc.yaml
kubectl apply -f k8s/services/notification-service-svc.yaml
kubectl apply -f k8s/services/api-gateway-service.yaml
kubectl apply -f k8s/services/frontend-svc.yaml

# Step 6: Wait for deployments
Write-Info "Waiting for all deployments to be ready..."
$deployments = @(
    "account-service",
    "transaction-service",
    "notification-service",
    "api-gateway",
    "frontend"
)

foreach ($deployment in $deployments) {
    Write-Info "Waiting for $deployment..."
    kubectl rollout status deployment/$deployment -n $Namespace --timeout=120s
}

# Step 7: Show status
Write-Success "Deployment complete!"
Write-Host ""
Write-Host "Pod Status:" -ForegroundColor Yellow
kubectl get pods -n $Namespace -o wide

Write-Host ""
Write-Host "Service Status:" -ForegroundColor Yellow
kubectl get svc -n $Namespace

# Step 8: Show access instructions
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   Access Instructions" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

if ($Environment -eq "dev") {
    Write-Host "To access the frontend locally, run:" -ForegroundColor Cyan
    Write-Host "  kubectl port-forward svc/frontend 8000:80 -n $Namespace" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open: http://localhost:8000" -ForegroundColor White
    Write-Host ""
    Write-Host "To access the API Gateway:" -ForegroundColor Cyan
    Write-Host "  kubectl port-forward svc/api-gateway 8080:8080 -n $Namespace" -ForegroundColor White
} else {
    Write-Host "Production URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://<AWS_HOST>/" -ForegroundColor White
    Write-Host "  API Gateway: http://<AWS_HOST>:8080/" -ForegroundColor White
}

Write-Host ""
Write-Success "Deployment script completed!"

