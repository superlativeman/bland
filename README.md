# Bland Demo - Job Application Form

A simple, modern one-page web application that allows job applicants to register their interest in vacancies. **Integrated with existing Supabase database schema!**

## Features

- **Clean, Modern Design**: Beautiful gradient background with a clean white form card
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Form Validation**: Real-time validation with helpful error messages
- **User-Friendly Interface**: Smooth animations and transitions
- **Success Feedback**: Clear confirmation when application is submitted
- **Supabase Integration**: Secure cloud database storage with existing schema
- **Data Persistence**: Applications are stored in existing `applicants` table

## Form Fields

The application captures the following information:
- **First Name** (required)
- **Last Name** (required)
- **Email Address** (required, with email validation)
- **Phone Number** (required, with phone validation and E164 formatting)
- **Position Applied For** (required dropdown with 3 options):
  - Solutions Engineer
  - Software Engineer
  - Data Scientist

## Prerequisites

Before running the application, you need to:

1. **Existing Supabase project** with the `applicants` table schema
2. **Updated RLS policies** to allow public access (see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md))
3. **Configured Supabase credentials** in `config.js`

## Getting Started

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
CREATE POLICY "applicants_public_insert" ON public.applicants
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "applicants_public_read" ON public.applicants
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "applicants_public_update" ON public.applicants
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

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

### Step 3: Run the Application

#### Option 1: Quick Start (Recommended)
```bash
./start-server.sh
```

#### Option 2: Manual Server Setup

**Using Python (if you have Python 3 installed)**
```bash
python3 server.py
```

**Using Node.js (if you have Node.js installed)**
```bash
npx http-server -p 3000 -o
```

**Using npm scripts (if you have Node.js installed)**
```bash
npm install
npm start
```

### Step 4: Test the Application

1. Open your browser to `http://localhost:3000`
2. Fill out and submit a test application
3. Check your Supabase dashboard to verify the data was stored in the `applicants` table

## File Structure

```
bland/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and responsive design
├── script.js               # JavaScript functionality with Supabase integration
├── config.js               # Supabase configuration
├── update-policies.sql     # SQL to update RLS policies
├── INTEGRATION_GUIDE.md    # Detailed integration guide
├── server.py               # Python server script
├── start-server.sh         # Quick start script
├── package.json            # Node.js configuration
└── README.md               # This documentation
```

## Technical Details

- **HTML5**: Semantic markup with proper form validation
- **CSS3**: Modern styling with gradients, shadows, and animations
- **Vanilla JavaScript**: No external dependencies required (except Supabase)
- **Supabase**: Cloud database with existing schema integration
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation
- **Local Server**: Multiple server options for development

## Database Schema Integration

The application integrates with your existing `applicants` table:

```sql
-- Key fields used by the application
first_name                 text not null,
last_name                  text not null,
email                      citext unique not null,
phone_e164                 text,                    -- E164 format
position_applied_for       text not null,
application_date           date not null default current_date,
still_interested           boolean not null default true,
accessibility_requirements boolean not null default false
```

### Field Mapping

| Form Field | Database Column | Type | Notes |
|------------|----------------|------|-------|
| First Name | `first_name` | text | Required |
| Last Name | `last_name` | text | Required |
| Email | `email` | citext | Required, unique |
| Phone | `phone_e164` | text | Formatted to E164 format |
| Position | `position_applied_for` | text | Required |

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

### Adding New Positions

To add new positions to the dropdown, edit the `select` element in `index.html`:

```html
<select id="position" name="position" required>
    <option value="">Select a position</option>
    <option value="solutions-engineer">Solutions Engineer</option>
    <option value="software-engineer">Software Engineer</option>
    <option value="data-scientist">Data Scientist</option>
    <option value="new-position">New Position</option>
</select>
```

### Styling Changes

The main styling is in `styles.css`. Key sections:
- Color scheme: Lines 8-9 (background gradient)
- Form styling: Lines 40-80
- Button styling: Lines 82-100

## Data Storage

Applications are stored in your existing **Supabase `applicants` table**, which provides:

- **Real-time capabilities**: Instant data updates
- **Automatic backups**: Your data is safe and secure
- **Scalability**: Handles any amount of data
- **Security**: Row Level Security (RLS) policies
- **API access**: Easy integration with other applications

### Data Access

You can view submitted applications in your Supabase dashboard:
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Click on `applicants`
4. View all submitted applications

## Troubleshooting

### Supabase Issues

- **Configuration errors**: Check `config.js` for correct URL and anon key
- **Database errors**: Verify the `applicants` table exists and RLS policies are updated
- **Permission errors**: Run the `update-policies.sql` script in Supabase
- **CORS errors**: Ensure you're running on a local server

### Server Issues

- **Port 3000 already in use**: Change the port in `server.py` or `package.json`
- **Permission denied**: Make sure `start-server.sh` is executable: `chmod +x start-server.sh`
- **Python not found**: Install Python 3 from https://www.python.org/downloads/
- **Node.js not found**: Install Node.js from https://nodejs.org/

### Browser Issues

- **CORS errors**: Use the local server instead of opening the file directly
- **Form not working**: Check browser console for JavaScript errors
- **Styling issues**: Clear browser cache or try incognito mode

## Security (Demo Tool)

Since this is a demo tool:

- **Public access**: All operations (read, write, update, delete) are publicly accessible
- **No authentication**: No user login required
- **Data validation**: Client-side validation for data integrity
- **E164 phone format**: Ensures consistent phone number storage

**Note**: These policies are suitable for demo purposes only. For production use, you should implement proper authentication and authorization.

## Production Deployment

When deploying to production:

1. **Update Supabase CORS settings** to allow your production domain
2. **Implement proper authentication** and authorization
3. **Configure backup strategies** in Supabase
4. **Monitor usage** in your Supabase dashboard
5. **Set up alerts** for errors or unusual activity

## License

This project is open source and available under the MIT License.
