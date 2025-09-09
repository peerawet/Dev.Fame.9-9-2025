# Database Design for FITWHEY E-commerce Platform

## Entity Relationship Diagram (ERD)

### Core Entities

#### 1. Users (ผู้ใช้งาน)

```
Users
├── user_id (PK, UUID)
├── email (UNIQUE, NOT NULL)
├── password_hash (NOT NULL)
├── first_name (VARCHAR(50))
├── last_name (VARCHAR(50))
├── phone (VARCHAR(20))
├── date_of_birth (DATE)
├── gender (ENUM: 'M', 'F', 'Other')
├── tier_level (ENUM: 'Basic', 'Pro', 'VIP')
├── points_balance (INT, DEFAULT 0)
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 2. Products (สินค้า)

```
Products
├── product_id (PK, UUID)
├── category_id (FK -> Categories.category_id)
├── brand_id (FK -> Brands.brand_id)
├── name (VARCHAR(255), NOT NULL)
├── description (TEXT)
├── short_description (VARCHAR(500))
├── base_price (DECIMAL(10,2), NOT NULL)
├── weight (DECIMAL(8,2))
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 3. Product_Variants (รูปแบบสินค้า)

```
Product_Variants
├── variant_id (PK, UUID)
├── product_id (FK -> Products.product_id)
├── size (VARCHAR(50)) -- Sample, 250g, 1lb, 2lb, 5lb, 10lb
├── flavor (VARCHAR(100)) -- Chocolate, Vanilla, etc.
├── price (DECIMAL(10,2), NOT NULL)
├── stock_quantity (INT, DEFAULT 0)
├── sku (VARCHAR(100), UNIQUE)
├── expiry_date (DATE)
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 4. Categories (หมวดหมู่สินค้า)

```
Categories
├── category_id (PK, UUID)
├── parent_category_id (FK -> Categories.category_id, NULL)
├── name (VARCHAR(100), NOT NULL)
├── description (TEXT)
├── image_url (VARCHAR(500))
├── sort_order (INT, DEFAULT 0)
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 5. Brands (แบรนด์)

```
Brands
├── brand_id (PK, UUID)
├── name (VARCHAR(100), NOT NULL)
├── description (TEXT)
├── logo_url (VARCHAR(500))
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 6. Shopping_Cart (ตะกร้าสินค้า)

```
Shopping_Cart
├── cart_id (PK, UUID)
├── user_id (FK -> Users.user_id)
├── variant_id (FK -> Product_Variants.variant_id)
├── quantity (INT, NOT NULL)
├── added_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 7. Orders (คำสั่งซื้อ)

```
Orders
├── order_id (PK, UUID)
├── user_id (FK -> Users.user_id)
├── order_number (VARCHAR(20), UNIQUE)
├── status (ENUM: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
├── subtotal (DECIMAL(10,2), NOT NULL)
├── discount_amount (DECIMAL(10,2), DEFAULT 0)
├── tier_discount_percentage (DECIMAL(5,2), DEFAULT 0)
├── points_used (INT, DEFAULT 0)
├── points_earned (INT, DEFAULT 0)
├── tax_amount (DECIMAL(10,2), DEFAULT 0)
├── shipping_fee (DECIMAL(10,2), DEFAULT 0)
├── total_amount (DECIMAL(10,2), NOT NULL)
├── shipping_address (JSON)
├── billing_address (JSON)
├── payment_method (VARCHAR(50))
├── payment_status (ENUM: 'pending', 'paid', 'failed', 'refunded')
├── notes (TEXT)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 8. Order_Items (รายการสินค้าในคำสั่งซื้อ)

```
Order_Items
├── item_id (PK, UUID)
├── order_id (FK -> Orders.order_id)
├── variant_id (FK -> Product_Variants.variant_id)
├── quantity (INT, NOT NULL)
├── unit_price (DECIMAL(10,2), NOT NULL)
├── tier_price (DECIMAL(10,2))
├── total_price (DECIMAL(10,2), NOT NULL)
├── created_at (TIMESTAMP)
```

#### 9. Product_Images (รูปภาพสินค้า)

```
Product_Images
├── image_id (PK, UUID)
├── product_id (FK -> Products.product_id)
├── image_url (VARCHAR(500), NOT NULL)
├── alt_text (VARCHAR(255))
├── sort_order (INT, DEFAULT 0)
├── is_primary (BOOLEAN, DEFAULT FALSE)
├── created_at (TIMESTAMP)
```

#### 10. Product_Reviews (รีวิวสินค้า)

```
Product_Reviews
├── review_id (PK, UUID)
├── product_id (FK -> Products.product_id)
├── user_id (FK -> Users.user_id)
├── order_id (FK -> Orders.order_id)
├── rating (INT, CHECK rating >= 1 AND rating <= 5)
├── title (VARCHAR(255))
├── comment (TEXT)
├── is_verified_purchase (BOOLEAN, DEFAULT FALSE)
├── likes_count (INT, DEFAULT 0)
├── is_approved (BOOLEAN, DEFAULT FALSE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 11. Review_Media (สื่อในรีวิว)

```
Review_Media
├── media_id (PK, UUID)
├── review_id (FK -> Product_Reviews.review_id)
├── media_type (ENUM: 'image', 'video')
├── media_url (VARCHAR(500), NOT NULL)
├── thumbnail_url (VARCHAR(500))
├── sort_order (INT, DEFAULT 0)
├── created_at (TIMESTAMP)
```

#### 12. User_Addresses (ที่อยู่ผู้ใช้)

```
User_Addresses
├── address_id (PK, UUID)
├── user_id (FK -> Users.user_id)
├── type (ENUM: 'shipping', 'billing')
├── first_name (VARCHAR(50))
├── last_name (VARCHAR(50))
├── phone (VARCHAR(20))
├── address_line_1 (VARCHAR(255))
├── address_line_2 (VARCHAR(255))
├── city (VARCHAR(100))
├── state (VARCHAR(100))
├── postal_code (VARCHAR(20))
├── country (VARCHAR(100))
├── is_default (BOOLEAN, DEFAULT FALSE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 13. Promotions (โปรโมชั่น)

```
Promotions
├── promotion_id (PK, UUID)
├── name (VARCHAR(255), NOT NULL)
├── description (TEXT)
├── type (ENUM: 'flash_sale', 'discount', 'bundle', 'points_multiplier')
├── discount_type (ENUM: 'percentage', 'fixed_amount', 'buy_x_get_y')
├── discount_value (DECIMAL(10,2))
├── min_order_amount (DECIMAL(10,2))
├── max_discount_amount (DECIMAL(10,2))
├── usage_limit (INT)
├── used_count (INT, DEFAULT 0)
├── start_date (TIMESTAMP)
├── end_date (TIMESTAMP)
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

#### 14. Product_Promotions (สินค้าที่อยู่ในโปรโมชั่น)

```
Product_Promotions
├── product_promotion_id (PK, UUID)
├── promotion_id (FK -> Promotions.promotion_id)
├── product_id (FK -> Products.product_id)
├── variant_id (FK -> Product_Variants.variant_id, NULL)
├── created_at (TIMESTAMP)
```

#### 15. User_Points_History (ประวัติคะแนน)

```
User_Points_History
├── history_id (PK, UUID)
├── user_id (FK -> Users.user_id)
├── order_id (FK -> Orders.order_id, NULL)
├── transaction_type (ENUM: 'earned', 'used', 'expired', 'refunded')
├── points_amount (INT, NOT NULL)
├── description (VARCHAR(255))
├── created_at (TIMESTAMP)
```

#### 16. Tier_Benefits (สิทธิประโยชน์ตาม Tier)

```
Tier_Benefits
├── benefit_id (PK, UUID)
├── tier_level (ENUM: 'Basic', 'Pro', 'VIP')
├── benefit_type (ENUM: 'discount_percentage', 'free_shipping', 'points_multiplier')
├── benefit_value (DECIMAL(10,2))
├── description (VARCHAR(255))
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMP)
```

## Relationships

### Primary Relationships:

- Users → Shopping_Cart (1:N)
- Users → Orders (1:N)
- Users → Product_Reviews (1:N)
- Users → User_Addresses (1:N)
- Users → User_Points_History (1:N)

- Products → Product_Variants (1:N)
- Products → Product_Images (1:N)
- Products → Product_Reviews (1:N)
- Products → Product_Promotions (1:N)

- Categories → Products (1:N)
- Categories → Categories (1:N) -- Self-referencing for subcategories
- Brands → Products (1:N)

- Orders → Order_Items (1:N)
- Product_Variants → Order_Items (1:N)
- Product_Variants → Shopping_Cart (1:N)

- Product_Reviews → Review_Media (1:N)

- Promotions → Product_Promotions (1:N)

## Indexes for Performance

### Primary Indexes:

- Users: email, tier_level, is_active
- Products: category_id, brand_id, is_active
- Product_Variants: product_id, sku, is_active
- Orders: user_id, status, created_at
- Product_Reviews: product_id, user_id, is_approved

### Composite Indexes:

- Shopping_Cart: (user_id, variant_id)
- Order_Items: (order_id, variant_id)
- Product_Images: (product_id, sort_order)
- User_Points_History: (user_id, created_at)

## Data Integrity Constraints

1. **Referential Integrity**: All foreign keys must reference valid records
2. **Check Constraints**:
   - Rating must be between 1-5
   - Points balance cannot be negative
   - Prices must be positive
3. **Unique Constraints**:
   - User email must be unique
   - Product SKU must be unique
   - Order number must be unique
4. **Not Null Constraints**: Critical fields like names, prices, and user credentials

## Security Considerations

1. **Password Storage**: Use bcrypt or similar hashing algorithm
2. **PII Protection**: Encrypt sensitive personal information
3. **Audit Trail**: Track all critical data changes
4. **Soft Deletes**: Use is_active flags instead of hard deletes
5. **Data Retention**: Implement policies for old data cleanup

This database design supports:

- Multi-tier customer system with benefits
- Complex product variants (size, flavor)
- Comprehensive order management
- Review system with media
- Promotion and discount management
- Points/loyalty system
- Flexible address management
