# Database Migrations

## Apply Full-Text Search Migration

To enable search functionality, run the migration in your Supabase dashboard:

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `20250125_add_full_text_search.sql`
4. Copy the SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

### What This Migration Does

- Adds a `search_vector` column to `post_translations` table
- Creates a GIN index for fast full-text search
- Enables weighted search: title (highest), excerpt (medium), content (lower)
- Supports multilingual search (English, French, Arabic, Urdu)

### Verify Migration

After running, verify with:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'post_translations'
AND column_name = 'search_vector';
```

You should see the `search_vector` column of type `tsvector`.
