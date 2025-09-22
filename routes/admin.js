var express = require('express');
var router = express.Router();
const connection = require('../db/mysql');
const { ifAdmin, checkUser } = require('./middleware/ifuser');

/* GET /dashboard page. */
router.get('/dashboard', checkUser, ifAdmin, (req, res) => {
    connection.query('SELECT * FROM users', (err, users) => {
        if (err) {
            req.flash('error', 'Database error');
            return res.render('Admin/dashboard', { users: [], error: req.flash('error'), success: req.flash('success') });
        }
        res.render('Admin/dashboard', {
            users,
            error: req.flash('error'),
            success: req.flash('success')
        });
    });
});

router.post('/make-admin/:id', checkUser, ifAdmin, (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            req.flash('error', 'Database error');
            return res.redirect('/admin/dashboard');
        }
        const user = results[0];
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/dashboard');
        }
        if (user.role === 'admin') {
            req.flash('error', 'User is already an admin');
            return res.redirect('/admin/dashboard');
        }
        connection.query(
            'UPDATE users SET role = "admin" WHERE id = ?',
            [userId],
            (err, result) => {
                if (err) {
                    req.flash('error', 'Database error');
                    return res.redirect('/admin/dashboard');
                }
                req.flash('success', 'User promoted to admin successfully!');
                res.redirect('/admin/dashboard');
            }
        );
    });
});


router.post('/delete/:id', checkUser, ifAdmin, (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            req.flash('error', 'Database error');
            return res.redirect('/admin/dashboard');
        }
        const user = results[0];
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/dashboard');
        }
        if (user.role === 'admin') {
            req.flash('error', 'Cannot delete an admin user');
            return res.redirect('/admin/dashboard');
        }
        connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) {
                req.flash('error', 'Database error');
                return res.redirect('/admin/dashboard');
            }
            req.flash('success', 'User deleted successfully!');
            res.redirect('/admin/dashboard');
        });
    });
});


module.exports = router;