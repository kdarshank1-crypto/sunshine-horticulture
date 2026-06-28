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
  price_retail numeric(10,2) not null,   -- 200g retail pack price (MYR)
  price_bulk numeric(10,2) not null,     -- 10kg bulk pack price (MYR)
  image_url text,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  tag text,                              -- e.g. "Bestseller", "Fresh Daily"
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
  pack_type text not null check (pack_type in ('retail', 'bulk')),
  price_at_time_of_order numeric(10,2) not null
);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products: publicly readable (anyone can browse the catalog)
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Orders: anyone can INSERT (for checkout flow), 
-- only service_role can SELECT/UPDATE (for webhooks & admin)
create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

create policy "Service role can read orders"
  on public.orders for select
  using (auth.role() = 'service_role');

create policy "Service role can update orders"
  on public.orders for update
  using (auth.role() = 'service_role');

-- Order Items: anyone can INSERT, only service_role can SELECT
create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

create policy "Service role can read order items"
  on public.order_items for select
  using (auth.role() = 'service_role');

-- =====================================================
-- 5. INDEXES
-- =====================================================
create index idx_orders_stripe_session on public.orders(stripe_session_id);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_order_items_order_id on public.order_items(order_id);

-- =====================================================
-- 6. SEED DATA — Products
-- =====================================================
insert into public.products (name, description, price_retail, price_bulk, image_url, stock_status, tag) values
  (
    'Japanese Cucumber',
    'Crisp & fresh, grown in the cool Cameron Highlands climate for exceptional taste and crunch.',
    4.50,
    85.00,
    '/images/japanese-cucumber.png',
    'in_stock',
    'Fresh Daily'
  ),
  (
    'Cabbage',
    'Natural & quality — dense, leafy heads harvested at peak maturity for wholesalers and retailers.',
    3.90,
    72.00,
    '/images/cabbage.png',
    'in_stock',
    'Bestseller'
  ),
  (
    'Fresh Tomatoes',
    'Carefully grown with natural goodness — vine-ripened for full flavour and vibrant colour.',
    5.20,
    95.00,
    '/images/tomatoes.png',
    'in_stock',
    'Popular'
  ),
  (
    'Pak Choy & Sawi',
    'Fresh daily harvest — tender, nutrient-rich Asian greens perfect for every kitchen.',
    4.00,
    78.00,
    '/images/pak-choy-sawi.png',
    'in_stock',
    'Daily Harvest'
  ),
  (
    'Premium Combo Box',
    'Curated selection of our freshest vegetables — perfect for families, restaurants, and retailers.',
    25.00,
    180.00,
    '/images/combo-box.png',
    'in_stock',
    'Limited Promo'
  );
