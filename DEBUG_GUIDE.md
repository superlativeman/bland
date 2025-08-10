# Debug Guide - Supabase Submission Issues

This guide will help you identify and fix issues with the Supabase integration.

## Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Submit a test application
4. Look for any error messages or warnings

Common error messages and solutions:

### "Supabase client not found"
- **Cause**: Supabase library not loaded or config.js not loaded
- **Solution**: Check that `index.html` includes the Supabase script before `config.js`

### "Database connection failed"
- **Cause**: Incorrect Supabase URL or anon key
- **Solution**: Verify credentials in `config.js`

### "Insert failed: new row violates row-level security policy"
- **Cause**: RLS policies not updated correctly
- **Solution**: Run the `update-policies.sql` script in Supabase

### "Insert failed: duplicate key value violates unique constraint"
- **Cause**: Email already exists in database
- **Solution**: Use a different email address for testing

## Step 2: Test Supabase Connection

1. Open `debug-supabase.html` in your browser
2. Check the console for any errors
3. The page will automatically test:
   - Supabase client initialization
   - Database connection
   - Insert operation
   - Cleanup operation

## Step 3: Verify RLS Policies

Run this SQL in your Supabase SQL Editor to check current policies:

```sql
-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY policyname;
```

You should see these policies:
- `applicants_public_insert`
- `applicants_public_read`
- `applicants_public_update`
- `applicants_public_delete`

## Step 4: Test Database Access

Run this SQL in your Supabase SQL Editor to test basic access:

```sql
-- Test basic select
SELECT COUNT(*) FROM applicants;

-- Test insert (this should work)
INSERT INTO applicants (
    first_name,
    last_name,
    email,
    phone_e164,
    position_applied_for,
    application_date,
    still_interested,
    accessibility_requirements,
    accessibility_notes
) VALUES (
    'Test',
    'User',
    'test@example.com',
    '+1234567890',
    'solutions-engineer',
    CURRENT_DATE,
    true,
    false,
    null
);

-- Clean up test data
DELETE FROM applicants WHERE email = 'test@example.com';
```

## Step 5: Check Network Tab

1. Open Developer Tools
2. Go to **Network** tab
3. Submit an application
4. Look for requests to your Supabase URL
5. Check the response status and content

## Step 6: Common Issues and Solutions

### Issue: "Failed to submit application" with no specific error
**Solution**: Check browser console for detailed error messages

### Issue: Form submits but no data appears in database
**Possible Causes**:
1. RLS policies blocking the insert
2. Data validation failing silently
3. Network issues

**Debugging Steps**:
1. Check browser console for errors
2. Verify RLS policies are correct
3. Test with `debug-supabase.html`

### Issue: Phone number validation errors
**Solution**: Ensure phone number is in valid format (7-15 digits)

### Issue: Email validation errors
**Solution**: Ensure email is in valid format and not already in database

## Step 7: Manual Testing

1. **Test with minimal data**:
   ```javascript
   // In browser console
   const testData = {
       first_name: 'Test',
       last_name: 'User',
       email: 'test@example.com',
       phone_e164: '+1234567890',
       position_applied_for: 'solutions-engineer',
       application_date: '2025-01-01',
       still_interested: true,
       accessibility_requirements: false,
       accessibility_notes: null
   };
   
   // Test insert
   const { data, error } = await window.supabaseClient
       .from('applicants')
       .insert([testData])
       .select();
   
   console.log('Result:', { data, error });
   ```

2. **Check if data was inserted**:
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM applicants WHERE email = 'test@example.com';
   ```

## Step 8: Environment Issues

### Local Development
- Ensure you're running on `http://localhost:3000` (not `file://`)
- Check CORS settings in Supabase dashboard
- Verify Supabase project is active (not paused)

### Production
- Update CORS settings to allow your domain
- Check Supabase project status
- Verify API keys are correct

## Step 9: Contact Support

If you're still having issues:

1. **Collect debug information**:
   - Browser console logs
   - Network tab requests
   - Supabase dashboard logs
   - Error messages

2. **Check Supabase status**:
   - Visit [Supabase Status Page](https://status.supabase.com)
   - Check your project dashboard for any issues

3. **Verify configuration**:
   - Supabase URL and anon key
   - RLS policies
   - Table schema

## Quick Fix Checklist

- [ ] Supabase library loaded in `index.html`
- [ ] `config.js` loaded after Supabase library
- [ ] Supabase credentials are correct
- [ ] RLS policies updated with `update-policies.sql`
- [ ] Running on local server (not file://)
- [ ] Browser console shows no errors
- [ ] Network requests to Supabase are successful
- [ ] Database table exists and is accessible
