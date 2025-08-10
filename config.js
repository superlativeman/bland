// Supabase Configuration
// Replace these values with your actual Supabase project credentials
const SUPABASE_CONFIG = {
    url: 'https://tjrozqntwbcubvekaedw.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm96cW50d2JjdWJ2ZWthZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDA5MzQsImV4cCI6MjA2OTkxNjkzNH0.jCH6X0aKHjdQ6aEnoW-lWtuqZzamYX-xdrwtS-uguwY'
};

// Initialize Supabase client
function initializeSupabase() {
    try {
        // Check if Supabase library is loaded
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded. Make sure the script is included before config.js');
            return false;
        }

        // Create the Supabase client
        const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        window.supabaseClient = supabase;
        console.log('Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        return false;
    }
}

// Try to initialize immediately if Supabase is already loaded
if (typeof window.supabase !== 'undefined') {
    initializeSupabase();
} else {
    // Wait for Supabase to load
    window.addEventListener('load', function() {
        // Try again after a short delay to ensure Supabase is loaded
        setTimeout(function() {
            if (!window.supabaseClient) {
                initializeSupabase();
            }
        }, 100);
    });
}
