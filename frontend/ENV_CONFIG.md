# PayFlow Frontend Environment Configuration

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

## Mode 1: Direct Service Calls (Default)

This is the default configuration for local development. Services are called directly without going through API Gateway.

```env
VITE_USE_GATEWAY=false
VITE_ACCOUNT_API_URL=http://localhost:8081
VITE_TRANSACTION_API_URL=http://localhost:8082
```

## Mode 2: API Gateway Mode

All requests go through the API Gateway. Use this to test the full microservices architecture.

```env
VITE_USE_GATEWAY=true
VITE_API_GATEWAY_URL=http://localhost:8080
```

## Production Configuration

For production deployment (Kubernetes/Cloud):

```env
VITE_USE_GATEWAY=true
VITE_API_GATEWAY_URL=https://api.payflow.example.com
```

## How to Switch Modes

1. Create `.env.local` file in the `frontend` directory
2. Add the appropriate configuration
3. Restart the Vite dev server (`npm run dev`)

## Checking Current Configuration

Open browser console - you'll see:
```
🔧 API Configuration: {
  useGateway: false,
  accountBaseUrl: "http://localhost:8081",
  transactionBaseUrl: "http://localhost:8082"
}
```

