create table if not exists public.retailer_master (
    id uuid primary key default gen_random_uuid(),
    retailer_code text not null unique,
    retailer_name text not null,
    business_name text,
    mobile_number text not null unique,
    address text,
    city text,
    state text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.orders
    add column if not exists order_source text not null default 'DIRECT_CUSTOMER',
    add column if not exists retailer_id uuid references public.retailer_master(id),
    add column if not exists placed_by_name text,
    add column if not exists placed_by_mobile text;

update public.orders
set placed_by_name = coalesce(placed_by_name, customer_name),
    placed_by_mobile = coalesce(placed_by_mobile, customer_mobile)
where placed_by_name is null or placed_by_mobile is null;

alter table public.conversation_state
    add column if not exists user_type text,
    add column if not exists beneficiary_mobile text,
    add column if not exists beneficiary_name text,
    add column if not exists beneficiary_guest_id uuid references public.guest_master(id),
    add column if not exists beneficiary_customer_id uuid references public.customer_master(id),
    add column if not exists retailer_id uuid references public.retailer_master(id),
    add column if not exists retailer_name text;

create index if not exists retailer_master_mobile_idx
    on public.retailer_master (mobile_number);
create index if not exists orders_order_source_idx
    on public.orders (order_source);
create index if not exists orders_retailer_id_idx
    on public.orders (retailer_id);
