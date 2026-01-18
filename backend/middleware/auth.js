const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // DEV MODE BYPASS
    // console.log("Auth NodeEnv:", process.env.NODE_ENV, "Token:", token); 
    if ((process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) && token.startsWith('mock-token-')) {
        const userId = token.replace('mock-token-', '');
        req.user = { id: userId, email: `mock-${userId}@test.com` };
        return next();
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticateUser;
