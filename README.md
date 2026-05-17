# My Personal Site — Supabase Setup Guide

## Step 1: Create a Supabase project
1. Go to https://supabase.com and sign up (free)
2. Click "New Project", give it a name, set a password, choose a region
3. Wait ~1 minute for it to provision

## Step 2: Create the tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Paste and run this entire SQL block:

```sql
-- PROFILE table (single row stores all profile data as JSON)
create table if not exists profile (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb
);

-- POSTS table
create table if not exists posts (
  id text primary key,
  tag text,
  title text,
  excerpt text,
  content text,
  cover text,
  date text,
  read_min integer default 5,
  created_at timestamptz default now()
);

-- PROJECTS table
create table if not exists projects (
  id text primary key,
  title text,
  description text,
  tags text,
  url text,
  cover text,
  created_at timestamptz default now()
);

-- EXPERIENCE table
create table if not exists experience (
  id text primary key,
  period text,
  role text,
  company text,
  description text,
  skills text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profile    enable row level security;
alter table posts      enable row level security;
alter table projects   enable row level security;
alter table experience enable row level security;

-- Allow public read + write (no login needed)
create policy "public all" on profile    for all using (true) with check (true);
create policy "public all" on posts      for all using (true) with check (true);
create policy "public all" on projects   for all using (true) with check (true);
create policy "public all" on experience for all using (true) with check (true);
```

## Step 3: Get your API keys
1. Go to **Settings → API** in your Supabase dashboard
2. Copy **Project URL** (looks like: https://abcdefgh.supabase.co)
3. Copy **anon / public** key (long string starting with "eyJ...")

## Step 4: Add your keys to cms.js
Open `js/cms.js` and replace lines 3–4:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // ← paste Project URL
const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY';               // ← paste anon key
```

## Step 5: Deploy to GitHub Pages
```bash
git add .
git commit -m "Add Supabase integration"
git push
```

Done! Your CMS now syncs across all devices.
