# FITWHEY - AWS Serverless Architecture Design

## Overview

ออกแบบ AWS Serverless Architecture สำหรับ FITWHEY E-commerce Platform โดยใช้:

- **AWS CDK** สำหรับ Infrastructure as Code
- **DynamoDB** สำหรับ NoSQL Database
- **Lambda Functions** สำหรับ API Backend
- **API Gateway** สำหรับ REST API Management
- **CloudFront** สำหรับ CDN และ Static Hosting

---

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 Bucket      │    │   Route 53      │
│   (CDN)         │    │   (Static Web)   │    │   (DNS)         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Lambda@Edge    │    │   Certificate   │
│   (REST API)    │    │   (Edge Compute) │    │   Manager       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Lambda        │────│   DynamoDB       │    │   ElastiCache   │
│   Functions     │    │   (NoSQL DB)     │    │   (Redis)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SQS/SNS       │    │   S3 Bucket      │    │   CloudWatch    │
│   (Messaging)   │    │   (File Storage) │    │   (Monitoring)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## DynamoDB Table Design

### Single Table Design Pattern

```typescript
// Primary Table: fitwhey-main
{
  PK: string,           // Partition Key
  SK: string,           // Sort Key
  GSI1PK: string,       // Global Secondary Index 1 PK
  GSI1SK: string,       // Global Secondary Index 1 SK
  GSI2PK: string,       // Global Secondary Index 2 PK
  GSI2SK: string,       // Global Secondary Index 2 SK
  EntityType: string,   // Entity type identifier
  ...attributes
}
```

### Entity Patterns

#### 1. User Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "PROFILE",
  GSI1PK: "USER_EMAIL#user@example.com",
  GSI1SK: "USER#123e4567-e89b-12d3-a456-426614174000",
  EntityType: "User",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  tier: "Pro",
  pointsBalance: 1500,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-12-20T10:30:00Z"
}
```

#### 2. Product Entity

```typescript
{
  PK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  SK: "METADATA",
  GSI1PK: "CATEGORY#whey-protein",
  GSI1SK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  GSI2PK: "BRAND#baam",
  GSI2SK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  EntityType: "Product",
  name: "Baam 100% My Whey",
  description: "เวย์โปรตีนคุณภาพสูง...",
  brand: "BAAM",
  category: "whey-protein",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z"
}
```

#### 3. Product Variant Entity

```typescript
{
  PK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  SK: "VARIANT#5lb-chocolate",
  GSI1PK: "VARIANT_SKU#BAAM-WHEY-5LB-CHOC",
  GSI1SK: "VARIANT#var_789",
  EntityType: "ProductVariant",
  variantId: "var_789",
  size: "5lb",
  flavor: "Chocolate",
  sku: "BAAM-WHEY-5LB-CHOC",
  price: {
    base: 1800,
    discounted: 1600,
    tierPrices: {
      Pro: 1550,
      VIP: 1500
    }
  },
  stockQuantity: 150,
  isAvailable: true
}
```

#### 4. Order Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "ORDER#2024-12-20#ord_789",
  GSI1PK: "ORDER#ord_789",
  GSI1SK: "2024-12-20T10:35:00Z",
  GSI2PK: "ORDER_STATUS#confirmed",
  GSI2SK: "2024-12-20T10:35:00Z",
  EntityType: "Order",
  orderId: "ord_789",
  orderNumber: "FW-2024-001234",
  status: "confirmed",
  totalAmount: 3162.15,
  items: [...],
  createdAt: "2024-12-20T10:35:00Z"
}
```

#### 5. Shopping Cart Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "CART#var_789",
  EntityType: "CartItem",
  variantId: "var_789",
  quantity: 2,
  addedAt: "2024-12-20T10:30:00Z"
}
```

### Global Secondary Indexes

#### GSI1: Entity Lookup Index

- **PK**: GSI1PK (Entity-specific lookups)
- **SK**: GSI1SK (Entity-specific sorting)

#### GSI2: Status/Category Index

- **PK**: GSI2PK (Status/Category grouping)
- **SK**: GSI2SK (Time-based sorting)

---

## Lambda Functions Architecture

### API Functions

#### 1. Product Service

```typescript
// functions/product-service/
├── get-product.ts          // GET /products/{id}
├── list-products.ts        // GET /products
├── search-products.ts      // GET /products/search
└── shared/
    ├── product-repository.ts
    └── product-models.ts
```

#### 2. Cart Service

```typescript
// functions/cart-service/
├── add-to-cart.ts          // POST /cart/items
├── get-cart.ts             // GET /cart
├── update-cart-item.ts     // PUT /cart/items/{id}
├── remove-cart-item.ts     // DELETE /cart/items/{id}
└── shared/
    ├── cart-repository.ts
    └── cart-models.ts
```

#### 3. Order Service

```typescript
// functions/order-service/
├── create-order.ts         // POST /orders
├── get-order.ts            // GET /orders/{id}
├── list-orders.ts          // GET /orders
├── update-order-status.ts  // PUT /orders/{id}/status
└── shared/
    ├── order-repository.ts
    ├── order-models.ts
    └── payment-service.ts
```

### Event-Driven Functions

#### 4. Event Processors

```typescript
// functions/events/
├── order-processor.ts      // SQS: Process new orders
├── inventory-updater.ts    // DynamoDB Streams: Update inventory
├── notification-sender.ts  // SNS: Send notifications
└── analytics-tracker.ts   // CloudWatch: Track metrics
```

---

## CDK Infrastructure Code

### Main Stack

```typescript
// lib/fitwhey-stack.ts
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";

export class FitwheyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const mainTable = new dynamodb.Table(this, "FitwheyMainTable", {
      tableName: "fitwhey-main",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Global Secondary Indexes
    mainTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
    });

    mainTable.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: { name: "GSI2PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "GSI2SK", type: dynamodb.AttributeType.STRING },
    });

    // Lambda Functions
    const productFunction = new lambda.Function(this, "ProductFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("dist/functions/product-service"),
      environment: {
        TABLE_NAME: mainTable.tableName,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "FitwheyApi", {
      restApiName: "FITWHEY API",
      description: "FITWHEY E-commerce API",
    });

    // S3 + CloudFront for Frontend
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "fitwhey-website",
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "WebsiteDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // Permissions
    mainTable.grantReadWriteData(productFunction);
  }
}
```

### Deployment Configuration

```typescript
// cdk.json
{
  "app": "npx ts-node --prefer-ts-exts bin/fitwhey.ts",
  "watch": {
    "include": ["**"],
    "exclude": [
      "README.md",
      "cdk*.json",
      "**/*.d.ts",
      "**/*.js",
      "tsconfig.json",
      "package*.json",
      "yarn.lock",
      "node_modules",
      "test"
    ]
  },
  "context": {
    "@aws-cdk/aws-lambda:recognizeLayerVersion": true,
    "@aws-cdk/core:checkSecretUsage": true,
    "@aws-cdk/core:target-partitions": ["aws", "aws-cn"]
  }
}
```

---

## API Gateway Configuration

### REST API Endpoints

```yaml
# API Structure
/api/v1/
├── /products
│   ├── GET /                    # List products
│   ├── GET /{id}               # Get product details
│   ├── GET /search             # Search products
│   └── GET /{id}/reviews       # Get product reviews
├── /cart
│   ├── GET /                   # Get cart
│   ├── POST /items             # Add to cart
│   ├── PUT /items/{id}         # Update cart item
│   └── DELETE /items/{id}      # Remove cart item
├── /orders
│   ├── GET /                   # List orders
│   ├── POST /                  # Create order
│   ├── GET /{id}               # Get order details
│   └── PUT /{id}/status        # Update order status
└── /users
    ├── GET /profile            # Get user profile
    ├── PUT /profile            # Update user profile
    └── GET /points/history     # Get points history
```

### Lambda Integration

```typescript
// API Gateway Integration
const productsResource = api.root.addResource("products");
productsResource.addMethod(
  "GET",
  new apigateway.LambdaIntegration(productFunction)
);

const productResource = productsResource.addResource("{id}");
productResource.addMethod(
  "GET",
  new apigateway.LambdaIntegration(productFunction)
);
```

---

## Security & Performance

### Security Measures

1. **API Gateway**: API Keys, Usage Plans, Throttling
2. **Lambda**: VPC configuration, IAM roles with least privilege
3. **DynamoDB**: Encryption at rest and in transit
4. **CloudFront**: WAF integration, HTTPS only
5. **Secrets Manager**: API keys and sensitive configuration

### Performance Optimizations

1. **DynamoDB**: On-demand billing, DAX caching
2. **Lambda**: Provisioned concurrency for critical functions
3. **API Gateway**: Caching enabled (5-minute TTL)
4. **CloudFront**: Global edge locations, compression
5. **ElastiCache**: Redis cluster for session management

### Monitoring & Logging

1. **CloudWatch**: Metrics, alarms, dashboards
2. **X-Ray**: Distributed tracing
3. **CloudTrail**: API call logging
4. **Lambda Insights**: Performance monitoring

---

## Deployment Strategy

### Environment Configuration

```typescript
// environments/
├── dev.ts                      # Development environment
├── staging.ts                  # Staging environment
└── prod.ts                     # Production environment

// Example: dev.ts
export const devConfig = {
  environment: 'dev',
  domainName: 'dev.fitwhey.com',
  certificateArn: 'arn:aws:acm:...',
  dynamodb: {
    billingMode: 'PAY_PER_REQUEST',
    pointInTimeRecovery: false,
  },
  lambda: {
    logLevel: 'DEBUG',
    timeout: 30,
  },
};
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build Lambda functions
        run: npm run build

      - name: Deploy with CDK
        run: |
          npx cdk deploy --require-approval never
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## Cost Optimization

### Pricing Model

1. **DynamoDB**: Pay-per-request pricing
2. **Lambda**: Pay-per-invocation + duration
3. **API Gateway**: Pay-per-request
4. **CloudFront**: Pay-per-data transfer
5. **S3**: Pay-per-storage + requests

### Estimated Monthly Costs (Production)

- DynamoDB: $50-100 (based on usage)
- Lambda: $20-50 (1M requests/month)
- API Gateway: $35-70 (1M requests/month)
- CloudFront: $10-30 (100GB transfer)
- S3: $5-15 (static assets)
- **Total**: ~$120-265/month

This serverless architecture provides:

- **Scalability**: Auto-scaling based on demand
- **Cost-effectiveness**: Pay only for what you use
- **High Availability**: Multi-AZ deployment
- **Security**: AWS best practices built-in
- **Maintainability**: Infrastructure as Code with CDK
