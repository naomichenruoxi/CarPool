
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY; // This is the service execution key

if (!supabaseServiceKey || !supabaseServiceKey.startsWith('sb_secret')) {
    console.error("Error: SUPABASE_KEY in .env does not appear to be a Service Role Key (should start with sb_secret).");
    console.error("Please ensure backend/.env has the correct service key.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
    const email = 'demo@carpool.com';
    const password = 'Password123!';

    console.log(`Attempting to create verified user: ${email}...`);

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // This confirms the email automatically
        user_metadata: { full_name: "Demo User" }
    });

    if (error) {
        console.error("Error creating user:", error);
    } else {
        console.log("User created successfully!");
        console.log("Email:", data.user.email);
        console.log("Password:", password);
    }
}

createTestUser();
