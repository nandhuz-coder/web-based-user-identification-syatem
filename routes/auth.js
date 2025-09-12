var express = require('express');
var router = express.Router();

// POST /auth/login - Accepts username or email and password
router.post('/login', function (req, res) {
    const { username, password } = req.body;
    //
});

router.get('/register', function (req, res) {
    res.render('Auth/register');
});

// ...existing code...

router.post('/register-submit', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Simple validation
    if (!username || !password || !confirmPassword) {
        return res.render('Auth/register', { error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
        return res.render('Auth/register', { error: 'Passwords do not match.' });
    }

    // TODO: Add logic to check if username exists and save user to DB

    // For now, just show a success message
    res.render('Auth/register', { success: 'Registration successful! You can now log in.' });
});

// ...existing code...
module.exports = router;