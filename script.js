document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const resetButton = document.getElementById('resetForm');
    const submitButton = document.querySelector('.submit-btn');

    // Function to check if Supabase is ready
    function checkSupabaseReady() {
        if (window.supabaseClient) {
            return true;
        }
        
        // Try to initialize if not already done
        if (typeof window.supabase !== 'undefined') {
            const supabase = window.supabase.createClient(
                'https://tjrozqntwbcubvekaedw.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcm96cW50d2JjdWJ2ZWthZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDA5MzQsImV4cCI6MjA2OTkxNjkzNH0.jCH6X0aKHjdQ6aEnoW-lWtuqZzamYX-xdrwtS-uguwY'
            );
            window.supabaseClient = supabase;
            console.log('Supabase client initialized in script.js');
            return true;
        }
        
        return false;
    }

    // Check if Supabase is configured
    if (!checkSupabaseReady()) {
        console.error('Supabase client not found. Please check your configuration in config.js');
        alert('Application configuration error. Please contact support.');
        return;
    }

    console.log('Supabase client found:', window.supabaseClient);

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if Supabase is still available
        if (!checkSupabaseReady()) {
            alert('Supabase connection lost. Please refresh the page and try again.');
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const applicationData = {
            firstName: formData.get('firstName').toLowerCase(),
            lastName: formData.get('lastName').toLowerCase(),
            email: formData.get('email').toLowerCase(),
            phone: formData.get('phone'),
            position: formData.get('position').toLowerCase()
        };

        console.log('Form data collected:', applicationData);

        // Validate form data
        if (!validateForm(applicationData)) {
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            console.log('Attempting to store application in Supabase...');
            
            // Store application data in Supabase using the existing applicants table
            const result = await storeApplication(applicationData);
            
            console.log('Store application result:', result);
            
            if (result.success) {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                console.log('Application submitted successfully!');
            } else {
                throw new Error(result.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again or contact support. Error: ' + error.message);
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.textContent = 'Submit Application';
            submitButton.disabled = false;
        }
    });

    // Reset form handler
    resetButton.addEventListener('click', function() {
        form.reset();
        form.style.display = 'flex';
        successMessage.classList.add('hidden');
    });

    // Form validation
    function validateForm(data) {
        const errors = [];

        // Check required fields
        if (!data.firstName.trim()) {
            errors.push('First name is required');
        }
        if (!data.lastName.trim()) {
            errors.push('Last name is required');
        }
        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        if (!data.phone.trim()) {
            errors.push('Phone number is required');
        } else if (!isValidPhone(data.phone)) {
            errors.push('Please enter a valid phone number with country code (e.g., +1234567890)');
        }
        if (!data.position) {
            errors.push('Please select a position');
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation and formatting for E164 format
    function isValidPhone(phone) {
        // Remove all non-digit characters except +
        const cleaned = phone.replace(/[^\d+]/g, '');
        
        // Must start with + and have country code + national number
        // Country codes are 1-3 digits, national numbers are 7-12 digits
        // Total length should be 8-15 digits (including country code)
        const phoneRegex = /^\+[1-9]\d{7,14}$/;
        
        if (!phoneRegex.test(cleaned)) {
            return false;
        }
        
        // Additional validation: ensure it's a reasonable length
        const digitsOnly = cleaned.substring(1); // Remove the +
        return digitsOnly.length >= 8 && digitsOnly.length <= 15;
    }

    // Format phone number to E164 format
    // E164 format: +[country code][national number]
    // Examples: +1234567890 (US), +447700900123 (UK), +33123456789 (France)
    function formatPhoneToE164(phone) {
        // Remove all non-digit characters except +
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        // If it doesn't start with +, it's invalid for E164
        if (!phone.startsWith('+')) {
            throw new Error('Phone number must include country code (e.g., +1, +44, +33)');
        }
        
        // Remove the + for processing
        cleaned = cleaned.substring(1);
        
        // Validate the format: country code (1-9) + national number (7-12 digits)
        if (cleaned.length < 8 || cleaned.length > 15) {
            throw new Error('Invalid phone number length. Must be 8-15 digits including country code.');
        }
        
        // Ensure it starts with a valid country code (1-9)
        if (!/^[1-9]/.test(cleaned)) {
            throw new Error('Invalid country code. Must start with 1-9.');
        }
        
        // Return in proper E164 format
        return '+' + cleaned;
    }

    // Store application data in Supabase using the existing applicants table
    async function storeApplication(data) {
        try {
            console.log('Starting storeApplication with data:', data);
            
            // Format phone number to E164 format
            let formattedPhone;
            try {
                formattedPhone = formatPhoneToE164(data.phone);
                console.log('Formatted phone:', formattedPhone);
            } catch (phoneError) {
                return { success: false, error: phoneError.message };
            }
            
            // Store position as lowercase with hyphens
            console.log('Original position:', data.position);
            const formattedPosition = data.position.replace(/\s+/g, '-');
            console.log('Formatted position with hyphens:', formattedPosition);
            
            const insertData = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone_e164: formattedPhone,
                position_applied_for: formattedPosition,
                application_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                still_interested: true, // Default to true for new applications
                accessibility_requirements: false, // Default to false
                accessibility_notes: null // Default to null
            };
            
            console.log('Final insertData position_applied_for:', insertData.position_applied_for);
            console.log('Prepared insert data:', insertData);
            
            // Try the insert operation
            const { data: result, error } = await window.supabaseClient
                .from('applicants')
                .insert([insertData])
                .select();

            console.log('Supabase response:', { result, error });

            if (error) {
                console.error('Supabase error:', error);
                
                // Check for specific error types
                if (error.message.includes('row-level security policy')) {
                    return { success: false, error: 'Database access denied. Please check RLS policies.' };
                } else if (error.message.includes('duplicate key')) {
                    return { success: false, error: 'An application with this email already exists.' };
                } else if (error.message.includes('violates not-null constraint')) {
                    return { success: false, error: 'Missing required fields. Please check your input.' };
                } else {
                    return { success: false, error: error.message };
                }
            }

            console.log('Application submitted successfully:', result);
            return { success: true, data: result };

        } catch (error) {
            console.error('Error storing application:', error);
            return { success: false, error: error.message };
        }
    }

    // Add some nice animations and interactions
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });

        // Add real-time validation feedback
        input.addEventListener('input', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Validate based on field type
        switch(fieldName) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    field.classList.add('error');
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    field.classList.add('error');
                    // Add custom error message
                    let errorMsg = field.parentNode.querySelector('.field-error');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'field-error';
                        errorMsg.style.color = '#ef4444';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '4px';
                        field.parentNode.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'Include country code (e.g., +1, +44, +33)';
                } else {
                    // Remove error message if valid
                    const errorMsg = field.parentNode.querySelector('.field-error');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
                break;
            case 'firstName':
            case 'lastName':
                if (value && value.length < 2) {
                    field.classList.add('error');
                }
                break;
        }
    }

    // Add error styling to CSS
    const style = document.createElement('style');
    style.textContent = `
        input.error, select.error {
            border-color: #e53e3e !important;
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
        }
        
        .form-group {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});
