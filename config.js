// Supabase Configuration
// Replace these values with your actual Supabase project credentials
const SUPABASE_CONFIG = {
    url: 'https://tjrozqntwbcubvekaedw.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm96cW50d2JjdWJ2ZWthZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDA5MzQsImV4cCI6MjA2OTkxNjkzNH0.jCH6X0aKHjdQ6aEnoW-lWtuqZzamYX-xdrwtS-uguwY'
};

// Bland AI Configuration
// Configure your Bland AI call settings here
const BLAND_AI_CONFIG = {
    // API Configuration
    apiKey: 'org_1403e741250fdaa939fe339f04239ec29517c91855191492b56e12f95d398b835cf5f69d061203e0663569',
    apiEndpoint: 'https://api.bland.ai/v1/calls',
    
    // Call Configuration
    pathwayId: '410646e9-4a96-4313-a073-930cbadf9bc6',
    model: 'turbo', // Options: 'base' or 'turbo'
    
    // Call Behavior Settings
    waitForGreeting: false,
    record: true,
    answeredByEnabled: true,
    noiseCancellation: false,
    interruptionThreshold: 100,
    blockInterruptions: false,
    maxDuration: 600, // Maximum call duration in seconds (5 minutes)
    
    // Voice and Language
    voice: 'Alexa', // Default voice
    language: 'en',
    backgroundTrack: 'office',
    
    // Voicemail Action
    voicemailAction: 'hangup' // Options: 'hangup', 'leave_message', 'transfer'
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
