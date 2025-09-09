## FITWHEY E-commerce – คำอธิบาย ERD (ภาษาไทย)

คำอธิบายโครงสร้างฐานข้อมูล (ERD) สำหรับระบบ E-commerce ของ FITWHEY ที่รองรับสินค้าแบบมีรูปแบบ (Variant) และรสชาติ (Flavor), ตะกร้า/สั่งซื้อ, รีวิว, โปรโมชั่น และการแจ้งเตือน พร้อมแผนภาพ Mermaid สำหรับเอกสาร

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

### โครงสร้างหลักของระบบ (7 ส่วน)

- **ระบบจัดการผู้ใช้ (User Management)**: ระดับสมาชิก, ผู้ใช้, ที่อยู่
- **ระบบจัดการสินค้า (Product Catalog)**: หมวดหมู่, สินค้า, รูปแบบ, รสชาติ, รูปภาพ, FAQ
- **ตะกร้าสินค้า (Shopping Cart)**
- **คำสั่งซื้อ (Order Management)**: คำสั่งซื้อ, รายการสินค้า
- **รีวิวสินค้า (Review System)**: รีวิว, รูป/วิดีโอในรีวิว, การโหวตรีวิว
- **โปรโมชั่น (Promotion System)**: โปรโมชั่น, ผูกสินค้าเข้าร่วมโปร
- **การแจ้งเตือน (Notification System)**: แจ้งเตือน, การดู/ปิดแจ้งเตือนของผู้ใช้

### 1) ระบบจัดการผู้ใช้ (User Management)

- **user_tiers (ระดับสมาชิก)**: ระดับ Regular/Pro/VIP, ส่วนลด/สิทธิประโยชน์, คะแนนขั้นต่ำ `min_points`
- **users (ผู้ใช้)**: บัญชี/โปรไฟล์, คะแนนสะสม `points`, สถานะใช้งาน, ผูก `user_tiers`
- **addresses (ที่อยู่)**: หลายที่อยู่ต่อผู้ใช้ (shipping/billing/both), ระบุ `is_default`
- **ความสัมพันธ์**: user_tiers → users (1:N), users → addresses (1:N)

### 2) ระบบจัดการสินค้า (Product Catalog)

- **categories**: โครงสร้างแบบต้นไม้ผ่าน `parent_id` (self-referencing)
- **products**: ข้อมูลพื้นฐาน/โภชนาการ, `average_rating`/`total_reviews`
- **product_variants**: ขนาด Sample/250g/1lb/… ราคา/สต็อกแยกกัน
- **product_flavors**: รสชาติ Chocolate/Vanilla/… พร้อม `hex_color`
- **product_variant_flavors**: SKU จริง (รวม Variant+Flavor), `sku`, `stock_quantity`, `expiry_date`
- **product_images / product_faqs**: รูปภาพ/คำถามที่พบบ่อย
- **ความสัมพันธ์**: categories → categories (1:N), categories → products (1:N), products → variants/flavors (1:N), variants+flavors → variant_flavors (N:M via table)

### 3) ตะกร้าสินค้า (Shopping Cart)

- **shopping_carts**: เก็บรายการ SKU (`variant_flavor_id`) ที่ผู้ใช้เพิ่มและ `quantity`
- **ความสัมพันธ์**: users → shopping_carts (1:N), product_variant_flavors → shopping_carts (1:N)

### 4) คำสั่งซื้อ (Order Management)

- **orders**: `order_number`, `status`/`payment_status`, snapshot ที่อยู่ (`shipping_address`/`billing_address` JSON)
- **order_items**: snapshot ชื่อ/ขนาด/รสชาติ/ราคา ณ เวลาซื้อ
- **ความสัมพันธ์**: users → orders (1:N), orders → order_items (1:N), product_variant_flavors → order_items (1:N)

### 5) รีวิวสินค้า (Review System)

- **reviews**: คะแนน 1–5, ความเห็น, `is_verified_purchase`, อนุมัติ `is_approved`
- **review_media / review_votes**: สื่อแนบรีวิว, โหวตช่วยได้/ไม่ได้
- **ความสัมพันธ์**: products → reviews (1:N), users → reviews (1:N), reviews → review_media (1:N), reviews → review_votes (1:N)

### 6) โปรโมชั่น (Promotion System)

- **promotions**: ประเภทโปร (flash_sale/discount/…)
- **promotion_products**: ผูกโปรกับสินค้า/variant เฉพาะ
- **ความสัมพันธ์**: promotions → promotion_products (1:N), products → promotion_products (1:N)

### 7) การแจ้งเตือน (Notification System)

- **notifications**: ข้อความ, กลุ่มเป้าหมาย, วิธีแสดงผล, เวลาเริ่ม/สิ้นสุด
- **user_notification_views**: ผู้ใช้ดู/ปิดแจ้งเตือนเมื่อใด
- **ความสัมพันธ์**: notifications → user_notification_views (1:N), users → user_notification_views (1:N)

### การทำงานร่วมกันของระบบ (Flow ย่อ)

- ผู้ใช้เลือกสินค้า → เลือก Variant (ขนาด) → เลือก Flavor (รสชาติ)
- เพิ่ม SKU (`product_variant_flavors`) ลงตะกร้า (`shopping_carts`) → ชำระเงิน → สร้าง `orders` และ `order_items`
- ได้รับสินค้าแล้วสามารถเขียน `reviews`
- สต็อกลดระดับ SKU, ติดตามวันหมดอายุ/ล็อตผลิต
- ราคา = ราคาพื้นฐาน Variant + ราคาเพิ่ม Flavor − ส่วนลด Tier − โปรโมชั่น
- คะแนน: ได้/ใช้คะแนน และมีผลต่อระดับสมาชิก

### หมายเหตุการออกแบบ (Highlights)

- โครงสร้างยืดหยุ่น รองรับหลายขนาด/รสชาติ และหมวดหมู่แบบ hierarchy
- ความถูกต้องของข้อมูล: Foreign Keys + snapshot ตอนสั่งซื้อ
- ประสิทธิภาพ: ดัชนีสำคัญสำหรับค้นหา/รายงาน
- ใช้ JSON fields เฉพาะจุดที่ต้องการความยืดหยุ่น (เช่น ที่อยู่ในออร์เดอร์)
- แยกความรับผิดชอบของตารางชัดเจน รองรับการขยายตัวในอนาคต
