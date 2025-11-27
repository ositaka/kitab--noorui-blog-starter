# Admin User Setup

This document explains how to set up admin users for comment moderation and other admin tasks.

## How It Works

Admin permissions are handled at the database level using Supabase Row Level Security (RLS) policies. This is the most secure approach as permissions are enforced by PostgreSQL itself, not just in application code.

## Apply the Migration

First, run the admin permissions migration in your Supabase SQL Editor:

```bash
# The migration file is located at:
supabase/migrations/20250127_admin_permissions.sql
```

Or if using Supabase CLI:
```bash
supabase migration up
```

## Mark a User as Admin

### Option 1: Via Supabase Dashboard (Recommended for Production)

1. Go to Supabase Dashboard → Authentication → Users
2. Find the user you want to make an admin
3. Click on the user to open their details
4. Scroll to "Raw User Meta Data"
5. Click "Edit" and add:
   ```json
   {
     "is_admin": true
   }
   ```
6. Save changes

### Option 2: Via SQL (Quick Setup)

Run this SQL in your Supabase SQL Editor:

```sql
-- Replace 'admin@example.com' with the actual admin email
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'::jsonb
)
WHERE email = 'admin@example.com';
```

### Option 3: Via Supabase Client (Programmatic)

```typescript
// In a server-side admin setup script
const { data, error } = await supabase.auth.admin.updateUserById(
  userId,
  {
    user_metadata: { is_admin: true }
  }
)
```

## What Admins Can Do

With admin permissions, users can:

- ✅ **Delete any comment** (not just their own)
- ✅ **Pin/unpin any comment** on any post
- ✅ **Edit any comment** (via RLS policies)
- ✅ **Access the admin dashboard** at `/[locale]/admin`
- ✅ **Moderate comments** via `/[locale]/admin/comments`

## Security Notes

1. **Database-Level Security**: Permissions are enforced by PostgreSQL RLS policies, not just application code
2. **Token-Based**: Admin status is checked via the JWT token's `user_metadata`
3. **Server-Side Only**: The `is_admin()` function runs on the server with `SECURITY DEFINER`
4. **No Client Bypass**: Even if someone modifies frontend code, they can't bypass RLS policies

## Testing Admin Access

1. Mark your user as admin using one of the methods above
2. **Log out and log back in** (important - JWT needs to refresh)
3. Navigate to any blog post with comments
4. Try deleting any comment (not just your own)
5. Go to `/[locale]/admin/comments` and test the moderation features

## Revoking Admin Access

To remove admin privileges:

### Via Dashboard:
1. Go to user details in Supabase Dashboard
2. Edit "Raw User Meta Data"
3. Remove the `is_admin` field or set it to `false`

### Via SQL:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'is_admin'
WHERE email = 'user@example.com';
```

## Troubleshooting

**Problem**: Admin permissions not working after setting `is_admin` flag

**Solution**: The user needs to log out and log back in to get a fresh JWT token with the updated metadata.

**Problem**: Getting "You must be logged in to delete comments" error

**Solution**: Ensure the user is authenticated and the migration has been applied.

**Problem**: Can delete own comments but not others'

**Solution**:
1. Verify the migration is applied: Check if `is_admin()` function exists in Supabase → Database → Functions
2. Check user metadata has `is_admin: true`
3. Log out and log back in to refresh the JWT

## Production Recommendations

1. **Limit Admin Count**: Only mark necessary users as admins
2. **Use Email Whitelist**: For extra security, consider using `is_admin_by_email()` function with a hardcoded list
3. **Audit Logs**: Consider adding audit logging for admin actions
4. **MFA**: Enable Multi-Factor Authentication for admin users
5. **Regular Reviews**: Periodically review who has admin access

## Alternative: Email Whitelist Approach

For maximum security in production, you can use the email whitelist approach:

1. Update the migration to add admin emails:
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (
    'admin1@yourdomain.com',
    'admin2@yourdomain.com'
    -- Add more admin emails here
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. Re-apply the migration
3. Admins are now determined by email hardcoded in the database function (more secure)
