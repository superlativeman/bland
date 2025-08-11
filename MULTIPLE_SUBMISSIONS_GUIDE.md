# Multiple Submissions Guide

This guide explains how to enable multiple submissions from the same email address and ensure proper ordering for the API call.

## Database Changes Required

### Step 1: Remove Unique Email Constraint

Run the following SQL in your Supabase SQL Editor:

```sql
-- Remove the unique constraint on email
ALTER TABLE public.applicants DROP CONSTRAINT IF EXISTS applicants_email_key;

-- Add an index on created_at for better performance on the API call
CREATE INDEX IF NOT EXISTS idx_applicants_created_at_desc ON public.applicants (created_at DESC);
```

### Step 2: Verify Changes

Check that the unique constraint was removed:

```sql
-- Check for unique constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'applicants'::regclass 
AND contype = 'u';
```

Check that the index was created:

```sql
-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'applicants'
ORDER BY indexname;
```

## What This Enables

### Before (Unique Email Constraint):
- ❌ Only one application per email address
- ❌ Subsequent submissions would fail with "duplicate key" error
- ❌ No way to track multiple applications from same person

### After (Multiple Submissions Allowed):
- ✅ Multiple applications per email address
- ✅ Each submission creates a new record
- ✅ Full application history tracked
- ✅ Latest submission always surfaced by API

## API Call Behavior

### Your API Call:
```
https://tjrozqntwbcubvekaedw.supabase.co/rest/v1/applicants?select=first_name,last_name,phone_e164,position_applied_for,application_date&order=created_at.desc&limit=1
```

### How It Works:
1. **`order=created_at.desc`**: Orders by creation time, newest first
2. **`limit=1`**: Returns only the most recent application
3. **Result**: Always gets the latest submission, regardless of email

### Example Scenarios:

**Scenario 1: First-time applicant**
- User submits application → New record created
- API returns: This application

**Scenario 2: Same user, different position**
- User submits another application → New record created
- API returns: The newer application (not the first one)

**Scenario 3: Same user, same position, updated details**
- User submits updated application → New record created
- API returns: The most recent submission

## Application Logic Changes

### JavaScript Updates Made:
1. **Removed duplicate email error handling** - No longer needed
2. **Each submission creates new record** - Full history maintained
3. **No validation conflicts** - Multiple submissions allowed

### Data Flow:
```
User submits form → New record created → API call returns latest
```

## Benefits

1. **Full Application History**: Track all submissions from same person
2. **Updated Information**: Latest contact details always available
3. **Position Changes**: Track career progression
4. **API Reliability**: Always returns most recent data
5. **No Data Loss**: Previous submissions preserved

## Considerations

### Storage:
- Database will grow faster with multiple submissions
- Consider data retention policies if needed

### Analytics:
- Can now track application patterns
- Multiple submissions from same person indicate high interest

### API Performance:
- `created_at.desc` index ensures fast ordering
- `limit=1` keeps response size minimal

## Testing

### Test Multiple Submissions:
1. Submit application with email `test@example.com`
2. Submit another application with same email
3. Verify both records exist in database
4. Verify API returns the newer submission

### Verify API Ordering:
```sql
-- Check ordering in database
SELECT 
    first_name,
    last_name,
    email,
    position_applied_for,
    created_at
FROM applicants 
WHERE email = 'test@example.com'
ORDER BY created_at DESC;
```

## Rollback (If Needed)

If you need to restore the unique constraint:

```sql
-- Add unique constraint back
ALTER TABLE public.applicants ADD CONSTRAINT applicants_email_key UNIQUE (email);

-- Remove the created_at index
DROP INDEX IF EXISTS idx_applicants_created_at_desc;
```

## Summary

With these changes:
- ✅ Multiple submissions from same email allowed
- ✅ Each submission creates new record
- ✅ API always returns latest submission
- ✅ Full application history preserved
- ✅ Better user experience for repeat applicants
