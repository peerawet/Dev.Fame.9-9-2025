# FITWHEY Project Structure - AWS Serverless

## Complete Project Structure

```
fitwhey-ecommerce/
├── README.md
├── package.json
├── tsconfig.json
├── cdk.json
├── .gitignore
├── .github/
│   └── workflows/
│       ├── deploy-dev.yml
│       ├── deploy-staging.yml
│       └── deploy-prod.yml
│
├── frontend/                           # Frontend Application
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── css/
│   │       │   ├── main.css
│   │       │   └── custom.css
│   │       ├── js/
│   │       │   └── fontaw.js
│   │       ├── img/
│   │       │   ├── baam-directions.png
│   │       │   ├── place-holder0.png
│   │       │   ├── place-holder0-1.png
│   │       │   ├── place-holder3.png
│   │       │   ├── product-mock3.png
│   │       │   └── profile-placeholder.png
│   │       └── icon/
│   │           ├── add-icon.svg
│   │           ├── cart-icon.svg
│   │           ├── closing-icon.svg
│   │           ├── dumbbell-icon.svg
│   │           └── [other icons...]
│   ├── src/
│   │   ├── components/
│   │   │   ├── cart-modal.js
│   │   │   ├── product-slider.js
│   │   │   └── notification.js
│   │   ├── pages/
│   │   │   ├── product-detail.html
│   │   │   ├── cart.html
│   │   │   └── checkout.html
│   │   └── services/
│   │       ├── api-client.js
│   │       ├── cart-service.js
│   │       └── auth-service.js
│   └── build/                          # Built static files
│
├── backend/                            # AWS CDK + Lambda Functions
│   ├── lib/
│   │   ├── fitwhey-stack.ts           # Main CDK Stack
│   │   ├── api-stack.ts               # API Gateway Stack
│   │   ├── database-stack.ts          # DynamoDB Stack
│   │   ├── auth-stack.ts              # Cognito Stack
│   │   └── frontend-stack.ts          # CloudFront + S3 Stack
│   │
│   ├── functions/                      # Lambda Functions
│   │   ├── product-service/
│   │   │   ├── get-product/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── list-products/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── search-products/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   └── shared/
│   │   │       ├── product-repository.ts
│   │   │       ├── product-models.ts
│   │   │       └── validation.ts
│   │   │
│   │   ├── cart-service/
│   │   │   ├── add-to-cart/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── get-cart/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── update-cart-item/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── remove-cart-item/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   └── shared/
│   │   │       ├── cart-repository.ts
│   │   │       ├── cart-models.ts
│   │   │       └── validation.ts
│   │   │
│   │   ├── order-service/
│   │   │   ├── create-order/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── get-order/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── list-orders/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── update-order-status/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   └── shared/
│   │   │       ├── order-repository.ts
│   │   │       ├── order-models.ts
│   │   │       ├── payment-service.ts
│   │   │       └── validation.ts
│   │   │
│   │   ├── user-service/
│   │   │   ├── get-profile/
│   │   │   ├── update-profile/
│   │   │   ├── get-points-history/
│   │   │   └── shared/
│   │   │       ├── user-repository.ts
│   │   │       └── user-models.ts
│   │   │
│   │   ├── event-handlers/
│   │   │   ├── order-processor/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── inventory-updater/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   ├── notification-sender/
│   │   │   │   ├── index.ts
│   │   │   │   └── handler.ts
│   │   │   └── analytics-tracker/
│   │   │       ├── index.ts
│   │   │       └── handler.ts
│   │   │
│   │   └── shared/                     # Shared utilities
│   │       ├── models/
│   │       │   ├── user.ts
│   │       │   ├── product.ts
│   │       │   ├── order.ts
│   │       │   └── cart.ts
│   │       ├── repositories/
│   │       │   ├── base-repository.ts
│   │       │   └── dynamodb-client.ts
│   │       ├── services/
│   │       │   ├── auth-service.ts
│   │       │   ├── email-service.ts
│   │       │   └── payment-service.ts
│   │       └── utils/
│   │           ├── logger.ts
│   │           ├── validator.ts
│   │           ├── error-handler.ts
│   │           └── response-builder.ts
│   │
│   ├── environments/
│   │   ├── dev.ts
│   │   ├── staging.ts
│   │   └── prod.ts
│   │
│   └── bin/
│       └── fitwhey.ts                  # CDK App Entry Point
│
├── docs/                               # Documentation
│   ├── README.md
│   ├── aws_architecture.md
│   ├── database_design.md
│   ├── api_design.md
│   ├── deployment_guide.md
│   └── user_guide.md
│
├── scripts/                            # Deployment Scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── test.sh
│   └── seed-data.sh
│
├── tests/                              # Test Files
│   ├── unit/
│   │   ├── functions/
│   │   │   ├── product-service.test.ts
│   │   │   ├── cart-service.test.ts
│   │   │   └── order-service.test.ts
│   │   └── shared/
│   │       ├── repositories.test.ts
│   │       └── services.test.ts
│   ├── integration/
│   │   ├── api-gateway.test.ts
│   │   ├── dynamodb.test.ts
│   │   └── auth.test.ts
│   └── e2e/
│       ├── user-journey.test.ts
│       └── checkout-flow.test.ts
│
└── tools/                              # Development Tools
    ├── data-migration/
    │   ├── migrate-products.ts
    │   └── seed-users.ts
    ├── monitoring/
    │   ├── cloudwatch-dashboard.json
    │   └── alerts.json
    └── local-dev/
        ├── docker-compose.yml
        └── dynamodb-local.json
```

## Package.json Configuration

```json
{
  "name": "fitwhey-ecommerce",
  "version": "1.0.0",
  "description": "FITWHEY E-commerce Platform - AWS Serverless",
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "cdk": "cdk",
    "deploy:dev": "cdk deploy --profile dev --context env=dev",
    "deploy:staging": "cdk deploy --profile staging --context env=staging",
    "deploy:prod": "cdk deploy --profile prod --context env=prod",
    "destroy": "cdk destroy",
    "synth": "cdk synth",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  },
  "dependencies": {
    "aws-cdk-lib": "^2.100.0",
    "aws-lambda": "^1.0.7",
    "aws-sdk": "^2.1490.0",
    "@aws-sdk/client-dynamodb": "^3.450.0",
    "@aws-sdk/lib-dynamodb": "^3.450.0",
    "@aws-sdk/client-s3": "^3.450.0",
    "@aws-sdk/client-ses": "^3.450.0",
    "joi": "^17.11.0",
    "uuid": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/jest": "^29.5.5",
    "@types/aws-lambda": "^8.10.122",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint": "^8.50.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.2.2",
    "aws-cdk": "^2.100.0"
  }
}
```

## Environment Configuration

### Development Environment

```typescript
// environments/dev.ts
export const devConfig = {
  environment: "dev",
  region: "ap-southeast-1",
  account: "123456789012",
  domainName: "dev.fitwhey.com",

  dynamodb: {
    tableName: "fitwhey-main-dev",
    billingMode: "PAY_PER_REQUEST",
    pointInTimeRecovery: false,
  },

  lambda: {
    runtime: "nodejs18.x",
    timeout: 30,
    memorySize: 512,
    logLevel: "DEBUG",
  },

  apiGateway: {
    throttling: {
      rateLimit: 1000,
      burstLimit: 2000,
    },
    caching: {
      enabled: true,
      ttl: 300, // 5 minutes
    },
  },

  cloudfront: {
    priceClass: "PriceClass_100",
    cacheBehaviors: {
      defaultTtl: 86400, // 24 hours
      maxTtl: 31536000, // 1 year
    },
  },
};
```

### Production Environment

```typescript
// environments/prod.ts
export const prodConfig = {
  environment: "prod",
  region: "ap-southeast-1",
  account: "987654321098",
  domainName: "fitwhey.com",

  dynamodb: {
    tableName: "fitwhey-main-prod",
    billingMode: "PAY_PER_REQUEST",
    pointInTimeRecovery: true,
    backupRetention: 35,
  },

  lambda: {
    runtime: "nodejs18.x",
    timeout: 30,
    memorySize: 1024,
    logLevel: "INFO",
    reservedConcurrency: 100,
  },

  apiGateway: {
    throttling: {
      rateLimit: 10000,
      burstLimit: 20000,
    },
    caching: {
      enabled: true,
      ttl: 300,
    },
  },

  cloudfront: {
    priceClass: "PriceClass_All",
    cacheBehaviors: {
      defaultTtl: 86400,
      maxTtl: 31536000,
    },
  },
};
```

## Deployment Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod

# Run tests
npm test

# Run linting
npm run lint

# Destroy stack
npm run destroy
```

## Key Benefits of This Structure

1. **🏗️ Modular Architecture**: แยกส่วนการทำงานชัดเจน
2. **🔄 Reusable Components**: Shared utilities และ models
3. **🧪 Testable**: Unit, integration, และ E2E tests
4. **📈 Scalable**: แต่ละ Lambda function แยกอิสระ
5. **🚀 CI/CD Ready**: GitHub Actions workflows
6. **📊 Monitorable**: CloudWatch integration
7. **💰 Cost Optimized**: Serverless pay-per-use model
8. **🔒 Secure**: AWS best practices built-in
