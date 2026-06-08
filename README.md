# AfriStock 🌍

> Authentic African visuals, built for creators.

The African stock photography platform — photos, vectors & footage from 54 countries, licensed and ready to use.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database/Auth**: Supabase *(plug in your project — see below)*
- **Payments**: Paystack *(Phase 2)*
- **Deploy**: Vercel

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Then fill in your Supabase credentials

# 3. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
afristock/
├── app/
│   ├── page.tsx           # Homepage
│   ├── browse/
│   │   ├── page.tsx       # Image grid + search + filters
│   │   └── [id]/page.tsx  # Asset detail + download
│   └── upload/
│       └── page.tsx       # Contributor upload form
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/
│       ├── AssetCard.tsx
│       ├── SearchBar.tsx
│       └── FilterBar.tsx
├── lib/
│   ├── mock-data.ts       # Seed data (replace with Supabase queries)
│   └── supabase.ts        # Supabase client
└── types/index.ts         # TypeScript types
```

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL to create the assets table:

```sql
create table assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  region text,
  country text,
  tags text[],
  type text default 'photo',
  license text default 'standard',
  price integer default 1500,
  preview_url text,
  download_url text,
  contributor_id uuid references auth.users(id),
  contributor_name text,
  width integer,
  height integer,
  downloads integer default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table assets enable row level security;

-- Anyone can read published assets
create policy "Public read" on assets for select using (true);

-- Contributors can insert their own
create policy "Contributors insert" on assets for insert
  with check (auth.uid() = contributor_id);
```

3. Add your Supabase URL and anon key to `.env.local`
4. Replace `MOCK_ASSETS` in `lib/mock-data.ts` with real Supabase queries

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard or:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Roadmap

See the full product roadmap in the AfriStock pitch docs.

- **Phase 1** (now): Browse, search, contributor upload portal ✅
- **Phase 2**: Subscriptions, payouts (Paystack), AI search
- **Phase 3**: Video, vectors, audio, mobile app
- **Phase 4**: Multilingual, multi-currency, continental scale

---

Built with ❤️ for Africa.
