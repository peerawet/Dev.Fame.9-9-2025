## FITWHEY E-commerce – ERD 

### แผนผัง ERD (Mermaid)

```mermaid
erDiagram
    %% User Management Tables
    user_tiers {
        int id PK
        varchar name
        text description
        decimal discount_percentage
        int min_points
        json benefits
        varchar icon
        timestamp created_at
    }

    users {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        varchar phone
        date date_of_birth
        enum gender
        varchar profile_image
        int tier_id FK
        int points
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    addresses {
        int id PK
        int user_id FK
        enum type
        varchar first_name
        varchar last_name
        varchar company
        varchar address_line_1
        varchar address_line_2
        varchar city
        varchar state_province
        varchar postal_code
        varchar country
        varchar phone
        boolean is_default
        timestamp created_at
    }

    %% Product Catalog Tables
    categories {
        int id PK
        varchar name
        text description
        int parent_id FK
        varchar slug UK
        varchar image
        boolean is_active
        int sort_order
        timestamp created_at
    }

    products {
        int id PK
        varchar name
        varchar slug UK
        text description
        text short_description
        int category_id FK
        varchar brand
        varchar sku UK
        decimal protein_per_serving
        int calories_per_serving
        decimal fat_per_serving
        decimal carbs_per_serving
        decimal bcaa_per_serving
        decimal glutamine_per_serving
        decimal average_rating
        int total_reviews
        varchar meta_title
        text meta_description
        boolean is_active
        boolean is_featured
        timestamp created_at
        timestamp updated_at
    }

    product_variants {
        int id PK
        int product_id FK
        varchar size_name
        decimal size_value
        varchar size_unit
        decimal base_price
        decimal sale_price
        decimal cost_price
        int stock_quantity
        int low_stock_threshold
        decimal weight_grams
        json dimensions_json
        boolean is_active
        int sort_order
        timestamp created_at
    }

    product_flavors {
        int id PK
        int product_id FK
        varchar flavor_name
        varchar flavor_code
        varchar hex_color
        boolean is_active
        int sort_order
        timestamp created_at
    }

    product_variant_flavors {
        int id PK
        int variant_id FK
        int flavor_id FK
        decimal additional_price
        int stock_quantity
        varchar sku UK
        date expiry_date
        varchar batch_number
        boolean is_active
        timestamp created_at
    }

    product_images {
        int id PK
        int product_id FK
        int variant_id FK
        int flavor_id FK
        varchar image_url
        varchar alt_text
        boolean is_primary
        int sort_order
        enum image_type
        timestamp created_at
    }

    product_faqs {
        int id PK
        int product_id FK
        text question
        text answer
        int sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    %% Shopping Cart Table
    shopping_carts {
        int id PK
        int user_id FK
        int variant_flavor_id FK
        int quantity
        timestamp created_at
        timestamp updated_at
    }

    %% Order Management Tables
    orders {
        int id PK
        varchar order_number UK
        int user_id FK
        enum status
        enum payment_status
        decimal subtotal
        decimal discount_amount
        decimal tax_amount
        decimal shipping_amount
        decimal total_amount
        int points_earned
        int points_used
        json shipping_address
        json billing_address
        timestamp order_date
        timestamp confirmed_at
        timestamp shipped_at
        timestamp delivered_at
        text customer_notes
        text admin_notes
        timestamp created_at
        timestamp updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int variant_flavor_id FK
        varchar product_name
        varchar variant_size
        varchar flavor_name
        varchar sku
        int quantity
        decimal unit_price
        decimal total_price
        timestamp created_at
    }

    %% Review System Tables
    reviews {
        int id PK
        int product_id FK
        int user_id FK
        int order_item_id FK
        int rating
        varchar title
        text comment
        varchar variant_size
        varchar flavor_name
        boolean is_verified_purchase
        int helpful_count
        int total_votes
        boolean is_approved
        boolean is_featured
        timestamp created_at
        timestamp updated_at
    }

    review_media {
        int id PK
        int review_id FK
        enum media_type
        varchar media_url
        varchar thumbnail_url
        varchar alt_text
        int sort_order
        timestamp created_at
    }

    review_votes {
        int id PK
        int review_id FK
        int user_id FK
        enum vote_type
        timestamp created_at
    }

    %% Promotion System Tables
    promotions {
        int id PK
        varchar name
        text description
        enum type
        enum discount_type
        decimal discount_value
        decimal max_discount_amount
        decimal min_order_amount
        int max_uses
        int max_uses_per_user
        timestamp start_date
        timestamp end_date
        boolean is_active
        timestamp created_at
    }

    promotion_products {
        int id PK
        int promotion_id FK
        int product_id FK
        int variant_id FK
        timestamp created_at
    }

    %% Notification System Tables
    notifications {
        int id PK
        enum type
        varchar title
        text message
        enum target_type
        int target_id
        enum display_location
        int auto_hide_seconds
        timestamp start_time
        timestamp end_time
        boolean is_active
        timestamp created_at
    }

    user_notification_views {
        int id PK
        int user_id FK
        int notification_id FK
        timestamp viewed_at
        timestamp dismissed_at
    }

    %% Relationships
    user_tiers ||--o{ users : "has"
    users ||--o{ addresses : "has"
    users ||--o{ orders : "places"
    users ||--o{ shopping_carts : "has"
    users ||--o{ reviews : "writes"
    users ||--o{ review_votes : "votes"
    users ||--o{ user_notification_views : "views"

    categories ||--o{ categories : "contains"
    categories ||--o{ products : "contains"

    products ||--o{ product_variants : "has"
    products ||--o{ product_flavors : "has"
    products ||--o{ product_images : "has"
    products ||--o{ product_faqs : "has"
    products ||--o{ reviews : "receives"
    products ||--o{ promotion_products : "participates"

    product_variants ||--o{ product_variant_flavors : "combines"
    product_flavors ||--o{ product_variant_flavors : "combines"

    product_variant_flavors ||--o{ shopping_carts : "added_to"
    product_variant_flavors ||--o{ order_items : "ordered"

    orders ||--o{ order_items : "contains"
    order_items ||--o{ reviews : "reviewed"

    reviews ||--o{ review_media : "has"
    reviews ||--o{ review_votes : "receives"

    promotions ||--o{ promotion_products : "applies_to"

    notifications ||--o{ user_notification_views : "viewed_by"
```
# Project Schema Overview

ผมให้ AI Generate schema ออกมา จาก ER Diagram จะมี table และ relation ต่างๆ มากมาย  
แต่ table ที่สำคัญที่สุดสำหรับ scope งานของ project นี้คือ **table `products`**

## อธิบายโครงสร้าง

1. **Product แต่ละตัว** จะอยู่ใน **Category** ต่างๆ เพื่อจัดเป็นหมวดหมู่  
2. **1 Product** มีได้หลาย **Promotions** และ **1 Promotion** มีได้หลาย **Products**  
3. แต่ละ **Product** จะมีหลาย **Images**, **FAQs**, **Reviews**  , **Variants (ขนาด)**, **Flavors (รสชาติ)**

## Variants และ Flavors

ที่สำคัญเลยก็คือ **Variants (ขนาด)**, **Flavors (รสชาติ)**  
ซึ่งจะมีตารางที่ประกอบ 2 attribute นี้เข้าด้วยกัน  
เรียกว่า **`product_variant_flavor`** ซึ่งจะเรียกว่า **1 SKU** และเป็น **Unique Key**

## ความสำคัญของ SKU

- **ตะกร้าสินค้า (Shopping Cart)**  
  เราไม่ได้ Add Product เข้าตะกร้าสินค้า แต่เรา Add **SKU** เข้าตะกร้าสินค้า และระบุจำนวนชิ้น  

- **Order**  
  แต่ละ Order ไม่ได้มีลิสต์ Products โดยตรง  
  แต่จะเป็นรายการ **SKU หลายๆ รายการ** ที่ประกอบกันเป็น 1 Order  
  ซึ่งอยู่ใน **ตาราง `order_items`**  

- **Inventory**  
  การนับ Stock จะนับตามจำนวนชิ้นของแต่ละ **SKU**  


