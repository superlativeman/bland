// Example Bland AI Configuration
// Copy this file to config.js and modify the values as needed

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Bland AI Configuration
const BLAND_AI_CONFIG = {
    // API Configuration
    apiKey: 'YOUR_BLAND_AI_API_KEY',
    apiUrl: 'https://api.bland.ai/v1/calls',
    
    // Basic Call Parameters
    pathwayId: 'YOUR_PATHWAY_ID',
    pathwayVersion: null, // Set to specific version number if needed
    voice: 'claude-3-sonnet', // Default voice model
    model: 'claude-3-sonnet', // AI model to use
    language: 'en', // Language for the call
    
    // Call Behavior Settings
    waitForGreeting: true, // Wait for human to speak first
    temperature: 0.7, // AI creativity level (0.0 to 1.0)
    interruptionThreshold: 0.5, // How easily AI can be interrupted
    maxDuration: 300, // Maximum call duration in seconds (5 minutes)
    
    // Call Flow Settings
    firstSentence: null, // Custom first sentence (overrides pathway)
    task: null, // Custom task description (overrides pathway)
    personaId: null, // Specific persona to use
    
    // Transfer and Routing
    transferPhoneNumber: null, // Number to transfer to
    transferList: {}, // Transfer configuration object
    
    // Audio and Quality Settings
    backgroundTrack: null, // Background music track
    noiseCancellation: true, // Enable noise cancellation
    blockInterruptions: false, // Block human interruptions
    record: true, // Record the call
    
    // Voicemail Settings
    voicemail: {
        action: 'leave_message', // 'hangup', 'leave_message', 'ignore'
        message: 'Hello, this is an AI recruitment assistant. We tried to reach you but couldn\'t connect. Please call us back or check your email for next steps.'
    },
    
    // Retry Configuration
    retry: {
        enabled: true,
        wait: 300, // Wait 5 minutes before retry
        voicemailAction: 'leave_message',
        voicemailMessage: 'Hello, this is an AI recruitment assistant. We tried to reach you earlier but couldn\'t connect. Please call us back or check your email for next steps.'
    },
    
    // Analysis and Post-Call Settings
    analysisPreset: null, // Analysis preset UUID
    summaryPrompt: 'Summarize this recruitment call, focusing on candidate qualifications, interest level, and any specific requirements or concerns mentioned.',
    dispositions: [
        'highly_qualified',
        'qualified',
        'needs_experience',
        'not_interested',
        'voicemail_left',
        'no_answer'
    ],
    
    // Webhook Configuration
    webhook: null, // Webhook URL for call events
    webhookEvents: ['call', 'tool', 'dynamic_data'], // Events to send to webhook
    
    // Advanced Settings
    pronunciationGuide: [], // Custom pronunciation guide
    dialingStrategy: {
        type: 'sequential', // 'sequential', 'parallel', 'round_robin'
        maxAttempts: 3
    },
    timezone: 'UTC', // Timezone for scheduling
    startTime: null, // Specific start time (ISO string)
    
    // Tools and Integrations
    tools: [], // Custom tools to use during call
    dynamicData: [], // External data sources
    citationSchemaIds: [], // Citation schemas for analysis
    
    // Keywords and Transcription
    keywords: ['recruitment', 'hiring', 'position', 'qualifications', 'experience'],
    ignoreButtonPress: false, // Ignore DTMF input
    
    // Metadata and Tracking
    metadata: {
        source: 'web_application',
        campaign: 'recruitment_demo',
        version: '1.0.0'
    },
    
    // Request Data (available during call)
    requestData: {
        applicationType: 'web_form',
        priority: 'normal'
    }
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
