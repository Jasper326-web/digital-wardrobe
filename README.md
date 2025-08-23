# Digital Wardrobe

A Next.js application for managing your clothing items and tracking their usage.

## Features

- Upload and manage clothing items by category (tops, pants, shoes)
- Camera capture functionality for item photos
- Cost-per-wear tracking
- Outfit planning and analytics
- Supabase integration for data persistence

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Database Setup

1. Run the SQL migrations in `supabase/migrations/` in your Supabase SQL editor:
   - `001_initial_schema.sql` - Initial database setup
   - `002_clothing_items.sql` - Clothing items table
   - `003_storage_policies.sql` - Storage access policies

## Storage Setup

1. Create a storage bucket named `wardrobe-images` in your Supabase dashboard
2. Set the bucket to public
3. Create folders: `tops`, `pants`, `shoes`
4. **Important**: Run the storage policies migration (`003_storage_policies.sql`) to enable file uploads

## Development

```bash
pnpm dev
```

## Troubleshooting

### Image Upload Issues
- Ensure you've run the storage policies migration
- Check that the `wardrobe-images` bucket exists and is public
- Verify your Supabase credentials in `.env.local`

### Camera Issues
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions for camera access
- Try refreshing the page if camera doesn't start
