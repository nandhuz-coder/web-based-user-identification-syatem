var express = require('express');
var router = express.Router();
const connection = require('../db/mysql');
const bcrypt = require('bcrypt');
const passports = require('./middleware/passport');
const roleRedirect = require('./middleware/redirect');

router.get('/register', function (req, res) {
    res.render('Auth/register', {
        error: req.flash('error'),
        success: req.flash('success')
    });
});

router.post('/login',
    passports.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true
    }),
    roleRedirect
);

router.post('/register-submit', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/auth/register');
    }
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/auth/register');
    }

    // Check if user already exists
    connection.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, results) => {
            if (err) {
                req.flash('error', 'Database error.');
                return res.redirect('/auth/register');
            }
            if (results.length > 0) {
                req.flash('error', 'Username or email already exists.');
                return res.redirect('/auth/register');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user to DB
            connection.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'user'],
                (err, result) => {
                    if (err) {
                        req.flash('error', 'Registration failed.');
                        return res.redirect('/auth/register');
                    }
                    req.flash('success', 'Registration successful! You can now log in.');
                    res.redirect('/auth/register');
                }
            );
        }
    );
});

module.exports = router;