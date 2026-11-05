-- 우리집냉장고 스키마. Supabase 대시보드 > SQL Editor 에 붙여넣고 Run.
create extension if not exists "pgcrypto";

create table if not exists public.fridge_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  ingredient_id text,
  category text not null,
  qty numeric not null default 1,
  unit text not null default '개',
  storage text not null default '냉장',
  purchased_at date not null default current_date,
  expires_at date not null,
  memo text,
  created_at timestamptz not null default now()
);
create index if not exists fridge_items_user_idx on public.fridge_items(user_id, expires_at);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  ingredient_id text,
  qty numeric not null default 1,
  unit text not null default '개',
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists shopping_items_user_idx on public.shopping_items(user_id, created_at desc);

alter table public.fridge_items enable row level security;
alter table public.shopping_items enable row level security;

drop policy if exists "own fridge items" on public.fridge_items;
create policy "own fridge items" on public.fridge_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own shopping items" on public.shopping_items;
create policy "own shopping items" on public.shopping_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
