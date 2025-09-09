# FITWHEY - E-commerce Platform (AWS Serverless)

**โปรเจค**: FITWHEY E-commerce Platform  
**Architecture**: AWS Serverless with DynamoDB  
**วันที่**: 9/9/2025
**ไฟล์**: Dev*[Fame]*[9/9/2025]

---

## สารบัญ

1. [Frontend Development](#frontend-development)
2. [AWS Serverless Architecture](#aws-serverless-architecture)
3. [DynamoDB Database Design](#dynamodb-database-design)
4. [API Design (AWS Lambda + API Gateway)](#api-design)
5. [Deployment & Infrastructure](#deployment--infrastructure)
6. [การทดสอบและการใช้งาน](#การทดสอบและการใช้งาน)

---

## Frontend Development

### ✅ งานที่ทำเสร็จ

#### 1.1 Product Detail Page (`product-detail-ion.html`)

- **Image Slider**: ใช้ Swiper.js สำหรับแสดงรูปภาพสินค้าแบบ carousel
- **Tab Navigation**: ระบบ tab สำหรับ Overview, Benefit, Direction, Storage, Cautions, Q&A
- **Size Selection**: เลือกขนาดสินค้า (Sample, 250g, 1lb, 2lb, 5lb, 10lb, 12lb)
- **Add to Cart**: ปุ่มเพิ่มสินค้าลงตะกร้า เปิด modal cart
- **Favorite Toggle**: ปุ่ม favorite สำหรับเก็บสินค้าที่ชื่นชอบ
- **Review Interaction**: ปุ่ม like/unlike สำหรับรีวิวสินค้า
- **Product Recommendations**: Slider สำหรับสินค้าแนะนำ

#### 1.2 Cart Modal Component (`components/cart-modal.js`)

- **Class-based Component**: ใช้ ES6 Class สำหรับจัดการ modal
- **Modal Management**: เปิด/ปิด modal ด้วย breakpoint
- **Product Selection**: เลือก size และ flavor ของสินค้า
- **Quantity Control**: เพิ่ม/ลดจำนวนสินค้า
- **Cart Actions**: Add to Cart, Buy Now พร้อม validation
- **Dynamic Updates**: สามารถอัพเดตข้อมูลสินค้าได้
- **Reusable**: สามารถใช้ในหน้าอื่นๆ ได้

#### 1.3 JavaScript Libraries ที่ใช้

- **Swiper.js**: สำหรับ image slider และ content slider
- **Ionic Framework**: UI components และ modal management
- **ES6 Classes**: สำหรับ component architecture
- **Vanilla JavaScript**: Event handling และ DOM manipulation

### 🔧 Features ที่เพิ่มเข้ามา

```javascript
// ตัวอย่าง code สำคัญ
// Tab switching functionality
tabButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    contentSlider.slideTo(index);
  });
});

// Cart state validation
function updateCartState() {
  const selectors = activeModal.querySelectorAll(".qcart-selector");
  let allSelected = true;
  selectors.forEach((selector) => {
    const selectedBtn = selector.querySelector(".selector-btn.select");
    if (!selectedBtn) allSelected = false;
  });
  // Enable/disable add to cart button based on selections
}
```

---

## AWS Serverless Architecture

### 🏗️ Architecture Overview

ใช้ AWS Serverless services เพื่อสร้างระบบ E-commerce ที่ scalable และ cost-effective:

- **AWS Lambda**: Serverless compute สำหรับ API handlers
- **API Gateway**: REST API management และ throttling
- **DynamoDB**: NoSQL database with single table design
- **CloudFront + S3**: Static website hosting และ CDN
- **Cognito**: User authentication และ authorization
- **SQS/SNS**: Event-driven messaging
- **CloudWatch**: Monitoring และ logging

---

## DynamoDB Database Design

### 📊 Single Table Design Pattern

ออกแบบฐานข้อมูล NoSQL สำหรับระบบ E-commerce โดยใช้ DynamoDB Single Table Design:

#### Table Structure

```
Table Name: fitwhey-main
Partition Key: PK (String)
Sort Key: SK (String)
Global Secondary Index 1: GSI1PK, GSI1SK
Global Secondary Index 2: GSI2PK, GSI2SK
```

#### Entity Types in Single Table

1. **Users** - ข้อมูลผู้ใช้และระดับสมาชิก (`USER#id`)
2. **Products** - ข้อมูลสินค้าหลัก (`PRODUCT#id`)
3. **Product_Variants** - รูปแบบสินค้า (`PRODUCT#id`, `VARIANT#size-flavor`)
4. **Categories** - หมวดหมู่สินค้า (`CATEGORY#name`)
5. **Brands** - แบรนด์สินค้า (`BRAND#name`)
6. **Shopping_Cart** - ตะกร้าสินค้า (`USER#id`, `CART#variantId`)
7. **Orders** - คำสั่งซื้อ (`USER#id`, `ORDER#date#orderId`)
8. **Order_Items** - รายการสินค้า (embedded in Orders)
9. **Product_Images** - รูปภาพสินค้า (embedded in Products)
10. **Product_Reviews** - รีวิวสินค้า (`PRODUCT#id`, `REVIEW#userId`)
11. **User_Addresses** - ที่อยู่ผู้ใช้ (`USER#id`, `ADDRESS#type`)
12. **Promotions** - โปรโมชั่น (`PROMOTION#id`)
13. **User_Points_History** - ประวัติคะแนน (`USER#id`, `POINTS#date`)
14. **Tier_Benefits** - สิทธิประโยชน์ตาม Tier (`TIER#level`)

#### Key Features

- **Single Table Design**: ประสิทธิภาพสูง, cost-effective
- **Multi-tier System**: Basic, Pro, VIP members
- **Complex Product Variants**: Size และ Flavor combinations
- **Points/Loyalty System**: Earn และ redeem points
- **Review System**: รีวิวพร้อมรูปภาพ/วิดีโอ
- **Promotion Management**: Flash sales, discounts, bundles
- **Real-time Inventory**: DynamoDB Streams สำหรับ updates

#### Performance Optimizations

- **DynamoDB DAX**: Microsecond latency caching
- **Global Secondary Indexes**: Efficient query patterns
- **Single Table**: Reduced network calls, atomic transactions
- **On-demand Billing**: Auto-scaling based on traffic

---

## API Design

### 🚀 3 APIs สำคัญที่ออกแบบ

#### 3.1 Product Catalog API

```http
GET /api/v1/products/{product_id}
```

**วัตถุประสงค์**: ดึงข้อมูลสินค้าสำหรับหน้า product detail

**Security Features**:

- JWT Authentication
- Rate limiting (100 req/min)
- Input validation (UUID format)
- HTTPS only

**Performance Features**:

- Redis caching (5-min TTL)
- CDN for images (24-hr TTL)
- Optimized database queries
- GZIP compression

**Data Accuracy**:

- Real-time stock validation
- Server-side price calculation
- Audit trail for changes

#### 3.2 Shopping Cart Management API

```http
POST /api/v1/cart/items
PUT /api/v1/cart/items/{item_id}
DELETE /api/v1/cart/items/{item_id}
```

**วัตถุประสงค์**: จัดการตะกร้าสินค้า

**Security Features**:

- User authorization
- CSRF protection
- Request deduplication
- SQL injection prevention

**Performance Features**:

- Optimistic locking
- Batch operations
- Redis session storage
- Connection pooling

**Data Accuracy**:

- Real-time stock checking
- Server-side price calculation
- Database transactions
- Foreign key constraints

#### 3.3 Order Processing API

```http
POST /api/v1/orders
```

**วัตถุประสงค์**: จัดการการสั่งซื้อและชำระเงิน

**Security Features**:

- Idempotency keys
- PCI DSS compliance
- Payment tokenization
- Comprehensive audit logging

**Performance Features**:

- Asynchronous processing
- Database transactions
- Caching for user data
- Webhook handling

**Data Accuracy**:

- Inventory reservation
- Price integrity validation
- Payment verification
- Order state management

### 📋 API Standards

- **AWS API Gateway**: Built-in throttling, caching, monitoring
- **Lambda Integration**: Event-driven, auto-scaling
- **Error Handling**: Structured error responses with CloudWatch logging
- **Rate Limiting**: Per-client throttling และ burst limits
- **Monitoring**: X-Ray tracing, CloudWatch metrics
- **Versioning**: API Gateway stages (v1, v2)
- **Documentation**: API Gateway console + OpenAPI export

---

## Deployment & Infrastructure

### 🚀 AWS CDK Infrastructure as Code

```typescript
// CDK Stack สำหรับ deployment
const stack = new FitwheyStack(app, "FitwheyStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "ap-southeast-1",
  },
});
```

### Deployment Commands

```bash
# Install AWS CDK
npm install -g aws-cdk

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy to development
cdk deploy --context env=dev

# Deploy to production
cdk deploy --context env=prod

# View differences before deploy
cdk diff

# Destroy stack
cdk destroy
```

### CI/CD Pipeline (GitHub Actions)

```yaml
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
      - name: Deploy with CDK
        run: cdk deploy --require-approval never
```

---

## การทดสอบและการใช้งาน

### 🌐 วิธีการเปิดโปรเจค

#### Option 1: เปิดด้วย Browser โดยตรง

```bash
# Windows
start design/product-detail-ion.html
start design/modal-cart-ion.html

# macOS/Linux
open design/product-detail-ion.html
open design/modal-cart-ion.html
```

#### Option 2: ใช้ Local Server (แนะนำ)

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# แล้วเปิด http://localhost:8000/design/
```

### ✅ Features ที่ทดสอบได้

#### Product Detail Page:

- [x] Image slider navigation
- [x] Tab switching (Overview, Benefit, etc.)
- [x] Size selection buttons
- [x] Add to cart button (เปิด modal)
- [x] Favorite toggle
- [x] Review like/unlike
- [x] Product recommendations slider

#### Cart Modal Component:

- [x] Component-based architecture
- [x] Modal open/close
- [x] Size และ flavor selection
- [x] Quantity increase/decrease
- [x] Add to cart validation
- [x] Buy now functionality
- [x] Dynamic product updates


### 🎯 สิ่งที่ส่งมอบ

1. ✅ **HTML Files**: เพิ่ม JavaScript functionality ครบถ้วน
2. ✅ **Database Design**: ERD ที่ครอบคลุมและเหมาะสม
3. ✅ **API Design**: 3 APIs ที่คำนึงถึง security, performance, data accuracy
4. ✅ **Documentation**: เอกสารที่อ่านง่ายและเข้าใจง่าย

---

## 💡 Technical Highlights

### Frontend:

- **Responsive Design**: ใช้ Ionic Framework
- **Interactive UI**: Swiper.js สำหรับ sliders
- **State Management**: JavaScript event handling
- **User Experience**: Smooth transitions และ feedback

### Backend Architecture:

- **Scalable Database**: 16 tables with proper relationships
- **RESTful APIs**: Standard HTTP methods และ status codes
- **Security First**: Authentication, authorization, data validation
- **Performance Optimized**: Caching, indexing, async processing

### Best Practices:

- **Code Quality**: Clean, readable JavaScript code
- **Documentation**: Comprehensive API documentation
- **Error Handling**: Graceful error management
- **Testing Ready**: APIs designed for easy testing

---

**หมายเหตุ**: โปรเจคนี้พร้อมสำหรับการพัฒนาต่อยอดเป็นระบบ E-commerce ที่สมบูรณ์ โดยมีโครงสร้างที่แข็งแรงและปลอดภัย
