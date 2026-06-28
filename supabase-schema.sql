-- =====================================================
-- Jabiru Agriculture — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL)
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  pricing jsonb not null,                -- e.g. [{"id": "retail", "label": "200g", "price": 4.5}, {"id": "bulk", "label": "10kg", "price": 85}]
  image_url text,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  tag text,                              -- e.g. "Promo", "Fresh Daily"
  created_at timestamptz default now()
);

-- =====================================================
-- 2. ORDERS TABLE
-- =====================================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  shipping_address jsonb not null,       -- { line1, line2, city, state, postcode }
  total_amount numeric(10,2) not null,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  stripe_session_id text unique,
  created_at timestamptz default now()
);

-- =====================================================
-- 3. ORDER ITEMS TABLE
-- =====================================================
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  pack_type text not null,               -- This matches the ID from the product's pricing JSON array (e.g. 'retail', 'promo_10kg', 'piece')
  pack_label text not null,              -- The human-readable label at the time of order (e.g. '10KG Promo')
  price_at_time_of_order numeric(10,2) not null
);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Anyone can create an order" on public.orders for insert with check (true);
create policy "Service role can read orders" on public.orders for select using (auth.role() = 'service_role');
create policy "Service role can update orders" on public.orders for update using (auth.role() = 'service_role');
create policy "Anyone can insert order items" on public.order_items for insert with check (true);
create policy "Service role can read order items" on public.order_items for select using (auth.role() = 'service_role');

-- =====================================================
-- 5. INDEXES
-- =====================================================
create index idx_orders_stripe_session on public.orders(stripe_session_id);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_order_items_order_id on public.order_items(order_id);

-- =====================================================
-- 6. SEED DATA — Products
-- =====================================================
insert into public.products (name, description, pricing, image_url, stock_status, tag) values
  (
    'Japanese Cucumber',
    'Crisp & fresh, grown in the cool Cameron Highlands climate. Special promo deal on bulk purchases!',
    '[{"id": "retail", "label": "200g Retail", "price": 4.50}, {"id": "promo_10kg", "label": "10KG Promo", "price": 15.00}]',
    '/images/japanese-cucumber.png',
    'in_stock',
    'Promo'
  ),
  (
    'Cabbage',
    'Natural & quality — dense, leafy heads harvested at peak maturity. Grab our promotional bulk pricing!',
    '[{"id": "retail", "label": "200g Retail", "price": 3.90}, {"id": "promo_10kg", "label": "10KG Promo", "price": 40.00}]',
    '/images/cabbage.png',
    'in_stock',
    'Promo'
  ),
  (
    'Premium AAA Sweet Corn',
    'Exceptionally sweet and juicy farm-fresh premium grade sweet corn.',
    '[{"id": "piece", "label": "1 Piece", "price": 3.50}]',
    '/images/combo-box.png',
    'in_stock',
    'Premium'
  ),
  (
    'Red & Green Capsicum',
    'Crunchy, sweet, and vibrant bell peppers for salads, stir-fries, and roasting.',
    '[{"id": "retail", "label": "200g Retail", "price": 6.00}, {"id": "bulk", "label": "10kg Bulk", "price": 110.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Green Coral Lettuce',
    'Crispy, fresh farm-direct greens perfect for salads and sandwiches.',
    '[{"id": "retail", "label": "200g Retail", "price": 5.00}, {"id": "bulk", "label": "10kg Bulk", "price": 90.00}]',
    '/images/pak-choy-sawi.png',
    'in_stock',
    'Fresh Daily'
  ),
  (
    'Cherry Tomato',
    'Premium sweet variety cherry tomatoes bursting with flavor.',
    '[{"id": "retail", "label": "200g Retail", "price": 6.00}, {"id": "bulk", "label": "10kg Bulk", "price": 105.00}]',
    '/images/tomatoes.png',
    'in_stock',
    'Premium'
  ),
  (
    'Eggplant (Brinjal)',
    'Glossy, tender farm-fresh eggplants.',
    '[{"id": "retail", "label": "200g Retail", "price": 4.50}, {"id": "bulk", "label": "10kg Bulk", "price": 85.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Chili',
    'Spicy, vibrant fresh chilies to add heat to your dishes.',
    '[{"id": "retail", "label": "200g Retail", "price": 8.00}, {"id": "bulk", "label": "10kg Bulk", "price": 150.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Tomato',
    'Vine-ripened, juicy tomatoes perfect for cooking and salads.',
    '[{"id": "retail", "label": "200g Retail", "price": 4.00}, {"id": "bulk", "label": "10kg Bulk", "price": 75.00}]',
    '/images/tomatoes.png',
    'in_stock',
    null
  ),
  (
    'Okra (Lady''s Finger)',
    'Tender, young okra pods freshly harvested.',
    '[{"id": "retail", "label": "200g Retail", "price": 5.00}, {"id": "bulk", "label": "10kg Bulk", "price": 90.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Long Beans',
    'Crisp, long green beans direct from our highland farms.',
    '[{"id": "retail", "label": "200g Retail", "price": 4.50}, {"id": "bulk", "label": "10kg Bulk", "price": 80.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Bitter Gourd',
    'Fresh bitter gourd, packed with nutrients.',
    '[{"id": "retail", "label": "200g Retail", "price": 5.50}, {"id": "bulk", "label": "10kg Bulk", "price": 95.00}]',
    '/images/combo-box.png',
    'in_stock',
    null
  ),
  (
    'Mega Veggie Wholesale Bundle',
    'A massive farm-fresh assortment including: Sawi Cameron (10KG), Siew Pak Choy (10KG), Spring Onions (10KG), Baby Romaine (8KG), and White Radish (10KG).',
    '[{"id": "bundle", "label": "Mega Bundle", "price": 100.00}]',
    '/images/combo-box.png',
    'in_stock',
    'Special Deal'
  );
