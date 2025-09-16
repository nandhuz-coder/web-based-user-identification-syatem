var express = require('express');
var router = express.Router();
const connection = require('../db/mysql');
const bcrypt = require('bcrypt');

// POST /auth/login - Accepts username or email and password
router.post('/login', function (req, res) {
    const { username, password } = req.body;
    //
});

router.get('/register', function (req, res) {
    res.render('Auth/register');
});


router.post('/register-submit', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.render('Auth/register', { error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
        return res.render('Auth/register', { error: 'Passwords do not match.' });
    }

    // Check if user already exists
    connection.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, results) => {
            if (err) return res.render('Auth/register', { error: 'Database error.' });
            if (results.length > 0) {
                return res.render('Auth/register', { error: 'Username or email already exists.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user to DB
            connection.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'user'],
                (err, result) => {
                    if (err) return res.render('Auth/register', { error: 'Registration failed.' });
                    res.render('Auth/register', { success: 'Registration successful! You can now log in.' });
                }
            );
        }
    );
});

module.exports = router;