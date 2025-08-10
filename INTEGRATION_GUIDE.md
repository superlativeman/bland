# Integration Guide - Existing Supabase Schema

This guide explains how to integrate the Bland Demo application with your existing Supabase database schema.

## Current Schema Overview

Your existing database has the following structure:

### `applicants` Table
- `id` (uuid, primary key)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `first_name` (text, required)
- `last_name` (text, required)
- `position_applied_for` (text, required)
- `application_date` (date, required)
- `still_interested` (boolean, default: true)
- `salary_expectations` (numeric(12,2))
- `email` (citext, unique, required)
- `phone_e164` (text, E164 format)
- `screening_call_at` (timestamptz)
- `interview_at` (timestamptz)
- `accessibility_requirements` (boolean, default: false)
- `accessibility_notes` (text)

### `candidate_calls` Table
- `id` (uuid, primary key)
- `created_at` (timestamptz)
- `applicant_id` (uuid, foreign key)
- `call_started_at` (timestamptz)
- `duration_seconds` (integer)
- `direction` (call_type enum: 'outbound', 'inbound')
- `with_person` (text)
- `outcome` (text)
- `notes` (text)

## Integration Steps

### Step 1: Update RLS Policies (Demo Tool - No Authentication Required)

Run the following SQL in your Supabase SQL Editor to allow public access for the demo tool:

```sql
-- Drop existing policies for applicants table
DROP POLICY IF EXISTS "applicants_read" ON public.applicants;
DROP POLICY IF EXISTS "applicants_write" ON public.applicants;
DROP POLICY IF EXISTS "applicants_update" ON public.applicants;
DROP POLICY IF EXISTS "applicants_delete" ON public.applicants;
DROP POLICY IF EXISTS "applicants_public_insert" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_read" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_update" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_delete" ON public.applicants;

-- Create new policies that allow public access for all operations (demo tool)
-- Allow public inserts (for the application form)
CREATE POLICY "applicants_public_insert" ON public.applicants
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow public reads (for viewing applications)
CREATE POLICY "applicants_public_read" ON public.applicants
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow public updates (for modifying applications)
CREATE POLICY "applicants_public_update" ON public.applicants
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow public deletes (for removing applications)
CREATE POLICY "applicants_public_delete" ON public.applicants
    FOR DELETE TO anon, authenticated
    USING (true);
```

### Step 2: Verify Configuration

Ensure your `config.js` file has the correct Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tjrozqntwbcubvekaedw.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

### Step 3: Test the Integration

1. Start your local server:
   ```bash
   ./start-server.sh
   ```

2. Open the application in your browser
3. Fill out and submit a test application
4. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Click on `applicants`
   - You should see your test application

## Field Mapping

The application maps form fields to your database schema as follows:

| Form Field | Database Column | Type | Notes |
|------------|----------------|------|-------|
| First Name | `first_name` | text | Required |
| Last Name | `last_name` | text | Required |
| Email | `email` | citext | Required, unique |
| Phone | `phone_e164` | text | Formatted to E164 format |
| Position | `position_applied_for` | text | Required |

### Default Values

The application sets the following default values for new applications:

- `application_date`: Current date
- `still_interested`: `true`
- `accessibility_requirements`: `false`
- `accessibility_notes`: `null`

## Phone Number Formatting

The application automatically formats phone numbers to E164 format:

- Removes all non-digit characters
- Adds `+` prefix if missing
- Handles US numbers (10 digits → +1XXXXXXXXXX)
- Validates format before submission

## Error Handling

The application includes comprehensive error handling:

- **Validation errors**: Client-side validation with user-friendly messages
- **Database errors**: Logged to console and displayed to user
- **Network errors**: Graceful fallback with retry options

## Security Considerations (Demo Tool)

Since this is a demo tool:

- **Public access**: All operations (read, write, update, delete) are publicly accessible
- **No authentication**: No user login required
- **Data validation**: Client-side validation for data integrity
- **E164 phone format**: Ensures consistent phone number storage

**Note**: These policies are suitable for demo purposes only. For production use, you should implement proper authentication and authorization.

## Troubleshooting

### Common Issues

1. **"Failed to submit application" error**
   - Check RLS policies are updated correctly
   - Verify Supabase credentials in `config.js`
   - Check browser console for detailed error messages

2. **Phone number validation errors**
   - Ensure phone number is in valid format
   - Check that phone number is at least 7 digits

3. **Email already exists error**
   - Your schema has unique constraint on email
   - Each email can only be used once

4. **CORS errors**
   - Ensure you're running on local server (not opening file directly)
   - Check Supabase project settings

### Debugging

1. **Check browser console** for JavaScript errors
2. **Check Supabase logs** in dashboard under **Logs**
3. **Test database connection** using Supabase SQL Editor
4. **Verify policies** by running the policy check query

## Data Access

You can view submitted applications in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Click on `applicants`
4. View all submitted applications

### Useful Queries

```sql
-- View recent applications
SELECT 
    first_name,
    last_name,
    email,
    position_applied_for,
    application_date,
    created_at
FROM applicants
ORDER BY created_at DESC
LIMIT 10;

-- View applications by position
SELECT 
    position_applied_for,
    COUNT(*) as count
FROM applicants
GROUP BY position_applied_for
ORDER BY count DESC;

-- View applications from today
SELECT *
FROM applicants
WHERE application_date = CURRENT_DATE;
```

## Next Steps

1. **Test thoroughly** with various data inputs
2. **Monitor usage** in Supabase dashboard
3. **Set up alerts** for errors or unusual activity
4. **Consider adding** additional fields if needed
5. **Plan for scaling** as application usage grows
