# DynamoDB Database Design - FITWHEY E-commerce Platform

## Single Table Design Pattern

### Overview

ใช้ **DynamoDB Single Table Design** ซึ่งเป็น best practice สำหรับ NoSQL และ AWS Serverless Architecture เพื่อ:

- **ลดค่าใช้จ่าย**: หนึ่งตารางแทนหลายตาราง
- **เพิ่มประสิทธิภาพ**: ลด network calls และ join operations
- **รองรับ Serverless**: เหมาะสำหรับ Lambda functions
- **Auto Scaling**: ปรับขนาดตามการใช้งานอัตโนมัติ

---

## Table Structure

```
Table Name: fitwhey-main
Partition Key: PK (String)
Sort Key: SK (String)

Global Secondary Index 1 (GSI1):
├── Partition Key: GSI1PK (String)
└── Sort Key: GSI1SK (String)

Global Secondary Index 2 (GSI2):
├── Partition Key: GSI2PK (String)
└── Sort Key: GSI2SK (String)
```

---

## Entity Patterns

### 1. User Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "PROFILE",
  GSI1PK: "USER_EMAIL#user@fitwhey.com",
  GSI1SK: "USER#123e4567-e89b-12d3-a456-426614174000",
  EntityType: "User",
  email: "user@fitwhey.com",
  firstName: "John",
  lastName: "Doe",
  tier: "Pro",
  pointsBalance: 1500,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z"
}
```

### 2. Product Entity

```typescript
{
  PK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  SK: "METADATA",
  GSI1PK: "CATEGORY#whey-protein",
  GSI1SK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  EntityType: "Product",
  name: "Baam 100% My Whey",
  description: "เวย์โปรตีนคุณภาพสูง...",
  brand: "BAAM",
  category: "whey-protein",
  isActive: true
}
```

### 3. Product Variant Entity

```typescript
{
  PK: "PRODUCT#550e8400-e29b-41d4-a716-446655440000",
  SK: "VARIANT#5lb-chocolate",
  GSI1PK: "VARIANT_SKU#BAAM-WHEY-5LB-CHOC",
  GSI1SK: "VARIANT#var_789",
  EntityType: "ProductVariant",
  size: "5lb",
  flavor: "Chocolate",
  price: { base: 1800, Pro: 1550, VIP: 1500 },
  stockQuantity: 150,
  isAvailable: true
}
```

### 4. Shopping Cart Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "CART#var_789",
  EntityType: "CartItem",
  variantId: "var_789",
  quantity: 2,
  unitPrice: 1550.00,
  addedAt: "2024-12-20T10:30:00Z"
}
```

### 5. Order Entity

```typescript
{
  PK: "USER#123e4567-e89b-12d3-a456-426614174000",
  SK: "ORDER#2024-12-20#ord_789",
  GSI1PK: "ORDER#ord_789",
  GSI1SK: "2024-12-20T10:35:00Z",
  EntityType: "Order",
  orderNumber: "FW-2024-001234",
  status: "confirmed",
  totalAmount: 3162.15,
  items: [...],
  createdAt: "2024-12-20T10:35:00Z"
}
```

---

## Access Patterns

### User Patterns

- Get user by ID: `PK = USER#{userId}`, `SK = PROFILE`
- Get user by email: `GSI1PK = USER_EMAIL#{email}`
- Get user cart: `PK = USER#{userId}`, `SK begins_with CART#`
- Get user orders: `PK = USER#{userId}`, `SK begins_with ORDER#`

### Product Patterns

- Get product: `PK = PRODUCT#{productId}`, `SK = METADATA`
- Get variants: `PK = PRODUCT#{productId}`, `SK begins_with VARIANT#`
- Get by category: `GSI1PK = CATEGORY#{categoryName}`
- Get by SKU: `GSI1PK = VARIANT_SKU#{sku}`

### Order Patterns

- Get order by ID: `GSI1PK = ORDER#{orderId}`
- Get orders by status: `GSI2PK = ORDER_STATUS#{status}`

---

## Performance Features

### 1. DynamoDB Optimizations

- **On-demand billing**: Auto-scaling
- **DynamoDB DAX**: Microsecond latency
- **Global Tables**: Multi-region replication
- **Streams**: Real-time data processing

### 2. Query Efficiency

- **Single table queries**: No joins needed
- **Batch operations**: Multiple items in one call
- **Consistent reads**: When data consistency is critical
- **Projection expressions**: Return only needed attributes

---

## Security & Compliance

### 1. Encryption

- **At rest**: AWS managed keys
- **In transit**: TLS 1.2+
- **Field-level**: Sensitive data encryption

### 2. Access Control

- **IAM roles**: Least privilege principle
- **VPC endpoints**: Private network access
- **Audit logging**: CloudTrail integration

This DynamoDB design supports all FITWHEY e-commerce requirements while providing:

- **High performance** (single-digit millisecond latency)
- **Cost efficiency** (pay-per-request pricing)
- **Scalability** (automatic scaling)
- **Reliability** (99.99% availability SLA)
