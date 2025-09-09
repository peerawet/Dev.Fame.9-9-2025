# API Design Document - FITWHEY E-commerce Platform

## AWS Serverless API Architecture

ออกแบบ RESTful APIs สำหรับระบบ E-commerce ของ FITWHEY บน AWS Serverless Architecture โดยใช้:

- **AWS API Gateway**: REST API Management, Throttling, Caching
- **AWS Lambda**: Serverless compute for API handlers
- **DynamoDB**: NoSQL database with single table design
- **ElastiCache (Redis)**: Caching layer for performance
- **AWS Cognito**: User authentication and authorization

### Architecture Benefits:

- **ความปลอดภัย (Security)**: AWS WAF, Cognito, IAM roles
- **ความเร็ว (Performance)**: Lambda@Edge, DynamoDB DAX, API Gateway caching
- **ความถูกต้องของข้อมูล (Data Accuracy)**: DynamoDB transactions, Lambda validation
- **Auto Scaling**: ปรับขนาดตามการใช้งานอัตโนมัติ
- **Cost Optimization**: จ่ายเฉพาะที่ใช้งาน (Pay-per-request)

---

## API 1: Product Catalog API

**วัตถุประสงค์**: จัดการข้อมูลสินค้าและการแสดงผลในหน้า product detail

### Endpoint: GET /api/v1/products/{product_id}

#### Request

```http
GET /api/v1/products/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {jwt_token}
Accept: application/json
```

#### Response Structure

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Baam 100% My Whey",
      "description": "เวย์โปรตีนคุณภาพสูง...",
      "short_description": "โปรตีนเสริมสร้างกล้ามเนื้อ",
      "brand": {
        "id": "brand_123",
        "name": "BAAM",
        "logo_url": "https://cdn.fitwhey.com/brands/baam-logo.png"
      },
      "category": {
        "id": "cat_456",
        "name": "Whey Protein",
        "parent_name": "Protein"
      },
      "images": [
        {
          "id": "img_1",
          "url": "https://cdn.fitwhey.com/products/baam-whey-1.jpg",
          "alt_text": "Baam My Whey front view",
          "is_primary": true,
          "sort_order": 1
        }
      ],
      "variants": [
        {
          "id": "var_789",
          "size": "5lb",
          "flavor": "Chocolate",
          "sku": "BAAM-WHEY-5LB-CHOC",
          "price": {
            "base": 1800.0,
            "discounted": 1600.0,
            "tier_prices": {
              "Pro": 1550.0,
              "VIP": 1500.0
            }
          },
          "stock_quantity": 150,
          "expiry_date": "2025-12-31",
          "is_available": true
        }
      ],
      "nutrition_facts": {
        "serving_size": "30g",
        "servings_per_container": 75,
        "calories": 140,
        "protein": 25,
        "fat": 2,
        "carbohydrates": 4
      },
      "reviews_summary": {
        "average_rating": 4.5,
        "total_reviews": 200,
        "rating_distribution": {
          "5": 120,
          "4": 60,
          "3": 15,
          "2": 3,
          "1": 2
        }
      },
      "promotions": [
        {
          "id": "promo_123",
          "type": "flash_sale",
          "name": "Flash Sale",
          "discount_percentage": 20,
          "end_time": "2024-12-31T23:59:59Z"
        }
      ]
    }
  },
  "meta": {
    "user_tier": "Pro",
    "points_earned": 500,
    "cache_timestamp": "2024-12-20T10:30:00Z"
  }
}
```

#### Security Measures

1. **Authentication**: JWT token validation
2. **Rate Limiting**: 100 requests/minute per user
3. **Input Validation**: UUID format validation for product_id
4. **Data Sanitization**: XSS protection on all text fields
5. **HTTPS Only**: All communications encrypted

#### Performance Optimizations

1. **Caching Strategy**:
   - Redis cache with 5-minute TTL for product data
   - CDN caching for images (24-hour TTL)
   - Database query optimization with proper indexes
2. **Database Optimization**:

   ```sql
   -- Optimized query with joins
   SELECT p.*, b.name as brand_name, c.name as category_name,
          AVG(pr.rating) as avg_rating, COUNT(pr.review_id) as review_count
   FROM products p
   LEFT JOIN brands b ON p.brand_id = b.brand_id
   LEFT JOIN categories c ON p.category_id = c.category_id
   LEFT JOIN product_reviews pr ON p.product_id = pr.product_id
   WHERE p.product_id = ? AND p.is_active = true
   GROUP BY p.product_id
   ```

3. **Response Compression**: GZIP compression enabled

#### Data Accuracy Measures

1. **Real-time Stock Validation**: Stock levels updated in real-time
2. **Price Consistency**: Tier-based pricing calculated server-side
3. **Data Validation**: All numeric fields validated for range and format
4. **Audit Trail**: All price changes and stock updates logged

---

## API 2: Shopping Cart Management API

**วัตถุประสงค์**: จัดการตะกร้าสินค้า รองรับการเพิ่ม/ลบ/แก้ไขสินค้า

### Endpoint: POST /api/v1/cart/items

#### Request

```http
POST /api/v1/cart/items
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Request-ID: req_12345

{
  "variant_id": "var_789",
  "quantity": 2,
  "selected_options": {
    "size": "5lb",
    "flavor": "Chocolate"
  }
}
```

#### Response Structure

```json
{
  "success": true,
  "data": {
    "cart_item": {
      "id": "cart_item_456",
      "variant_id": "var_789",
      "product_name": "Baam 100% My Whey",
      "variant_details": {
        "size": "5lb",
        "flavor": "Chocolate",
        "sku": "BAAM-WHEY-5LB-CHOC"
      },
      "quantity": 2,
      "unit_price": 1550.0,
      "total_price": 3100.0,
      "added_at": "2024-12-20T10:30:00Z"
    },
    "cart_summary": {
      "total_items": 3,
      "subtotal": 4500.0,
      "estimated_shipping": 100.0,
      "tier_discount": 225.0,
      "points_applicable": 450,
      "estimated_total": 4375.0
    }
  },
  "meta": {
    "request_id": "req_12345",
    "processing_time_ms": 120
  }
}
```

#### Security Measures

1. **User Authorization**: Verify cart ownership
2. **CSRF Protection**: CSRF tokens for state-changing operations
3. **Request Deduplication**: X-Request-ID header prevents duplicate requests
4. **Input Sanitization**: Validate all input parameters
5. **SQL Injection Prevention**: Parameterized queries

#### Performance Optimizations

1. **Optimistic Locking**: Prevent race conditions during cart updates

   ```sql
   UPDATE shopping_cart
   SET quantity = ?, updated_at = NOW(), version = version + 1
   WHERE cart_id = ? AND user_id = ? AND version = ?
   ```

2. **Batch Operations**: Support bulk cart updates
3. **Session Storage**: Cart data stored in Redis for fast access
4. **Connection Pooling**: Database connection pooling for scalability

#### Data Accuracy Measures

1. **Stock Validation**: Real-time stock checking before adding to cart

   ```javascript
   // Pseudo-code for stock validation
   const validateStock = async (variantId, quantity) => {
     const variant = await getVariantWithLock(variantId);
     if (variant.stock_quantity < quantity) {
       throw new InsufficientStockError();
     }
     return true;
   };
   ```

2. **Price Consistency**: Server-side price calculation
3. **Transaction Safety**: Database transactions for cart operations
4. **Data Integrity**: Foreign key constraints and validation rules

### Additional Cart Endpoints:

#### GET /api/v1/cart

```http
GET /api/v1/cart
Authorization: Bearer {jwt_token}
```

#### PUT /api/v1/cart/items/{item_id}

```http
PUT /api/v1/cart/items/cart_item_456
{
  "quantity": 3
}
```

#### DELETE /api/v1/cart/items/{item_id}

```http
DELETE /api/v1/cart/items/cart_item_456
```

---

## API 3: Order Processing API

**วัตถุประสงค์**: จัดการการสั่งซื้อ รองรับการชำระเงินและการจัดการคำสั่งซื้อ

### Endpoint: POST /api/v1/orders

#### Request

```http
POST /api/v1/orders
Authorization: Bearer {jwt_token}
Content-Type: application/json
Idempotency-Key: order_key_789

{
  "cart_id": "cart_123",
  "shipping_address_id": "addr_456",
  "billing_address_id": "addr_456",
  "payment_method": "credit_card",
  "payment_details": {
    "token": "pm_1234567890",
    "save_card": false
  },
  "points_to_use": 100,
  "special_instructions": "Please deliver in the morning"
}
```

#### Response Structure

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_789",
      "order_number": "FW-2024-001234",
      "status": "confirmed",
      "items": [
        {
          "id": "item_1",
          "variant_id": "var_789",
          "product_name": "Baam 100% My Whey",
          "variant_details": {
            "size": "5lb",
            "flavor": "Chocolate"
          },
          "quantity": 2,
          "unit_price": 1550.0,
          "total_price": 3100.0
        }
      ],
      "pricing": {
        "subtotal": 3100.0,
        "tier_discount": 155.0,
        "points_discount": 100.0,
        "shipping_fee": 100.0,
        "tax_amount": 217.15,
        "total_amount": 3162.15
      },
      "payment": {
        "method": "credit_card",
        "status": "paid",
        "transaction_id": "txn_456789",
        "paid_at": "2024-12-20T10:35:00Z"
      },
      "shipping": {
        "address": {
          "name": "John Doe",
          "phone": "+66812345678",
          "address_line_1": "123 Main St",
          "city": "Bangkok",
          "postal_code": "10110"
        },
        "estimated_delivery": "2024-12-22T18:00:00Z"
      },
      "points": {
        "used": 100,
        "earned": 316
      },
      "created_at": "2024-12-20T10:35:00Z"
    }
  },
  "meta": {
    "idempotency_key": "order_key_789",
    "processing_time_ms": 850
  }
}
```

#### Security Measures

1. **Idempotency**: Prevent duplicate orders using Idempotency-Key
2. **Payment Security**:
   - PCI DSS compliance
   - Tokenized payment processing
   - No sensitive card data stored
3. **Order Validation**:
   - Verify cart ownership
   - Validate shipping addresses
   - Check payment authorization
4. **Audit Logging**: Complete order trail for compliance
5. **Data Encryption**: Sensitive data encrypted at rest

#### Performance Optimizations

1. **Asynchronous Processing**:

   ```javascript
   // Order processing flow
   const processOrder = async (orderData) => {
     // 1. Create order (synchronous)
     const order = await createOrder(orderData);

     // 2. Process payment (synchronous)
     const payment = await processPayment(order);

     // 3. Update inventory (asynchronous)
     await updateInventoryAsync(order.items);

     // 4. Send notifications (asynchronous)
     await sendOrderConfirmationAsync(order);

     return order;
   };
   ```

2. **Database Transactions**: Ensure data consistency

   ```sql
   BEGIN TRANSACTION;

   -- Create order
   INSERT INTO orders (...) VALUES (...);

   -- Create order items
   INSERT INTO order_items (...) VALUES (...);

   -- Update inventory
   UPDATE product_variants
   SET stock_quantity = stock_quantity - ?
   WHERE variant_id = ?;

   -- Update user points
   UPDATE users
   SET points_balance = points_balance - ? + ?
   WHERE user_id = ?;

   COMMIT;
   ```

3. **Caching Strategy**: Cache user addresses and payment methods

#### Data Accuracy Measures

1. **Inventory Management**:

   - Real-time stock updates
   - Reserved inventory during checkout
   - Automatic stock release on payment failure

2. **Price Integrity**:

   - Server-side price calculation
   - Tax calculation based on shipping address
   - Tier discount validation

3. **Payment Verification**:

   - Webhook verification for payment status
   - Reconciliation with payment provider
   - Retry mechanism for failed payments

4. **Order State Management**:
   ```javascript
   const orderStateMachine = {
     pending: ["confirmed", "cancelled"],
     confirmed: ["processing", "cancelled"],
     processing: ["shipped", "cancelled"],
     shipped: ["delivered"],
     delivered: [],
     cancelled: [],
   };
   ```

### Additional Order Endpoints:

#### GET /api/v1/orders/{order_id}

```http
GET /api/v1/orders/ord_789
Authorization: Bearer {jwt_token}
```

#### PUT /api/v1/orders/{order_id}/cancel

```http
PUT /api/v1/orders/ord_789/cancel
{
  "reason": "customer_request",
  "notes": "Customer changed mind"
}
```

#### GET /api/v1/orders/{order_id}/tracking

```http
GET /api/v1/orders/ord_789/tracking
```

---

## Common API Standards

### Error Handling

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Not enough stock available",
    "details": {
      "requested": 5,
      "available": 3,
      "variant_id": "var_789"
    }
  },
  "meta": {
    "request_id": "req_12345",
    "timestamp": "2024-12-20T10:30:00Z"
  }
}
```

### Rate Limiting Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640001600
```

### Monitoring & Logging

1. **Request Logging**: All API requests logged with unique IDs
2. **Performance Monitoring**: Response time tracking
3. **Error Tracking**: Comprehensive error logging and alerting
4. **Business Metrics**: Order conversion rates, cart abandonment

### API Versioning

- URL versioning: `/api/v1/`
- Backward compatibility maintained for 2 major versions
- Deprecation notices in response headers

### Documentation

- OpenAPI 3.0 specification
- Interactive API documentation
- SDK generation for mobile apps
- Postman collection for testing

This API design ensures scalability, security, and reliability for the FITWHEY e-commerce platform while maintaining excellent performance and data accuracy.
