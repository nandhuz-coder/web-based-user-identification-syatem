var express = require('express');
var router = express.Router();
const connection = require('../db/mysql');
const bcrypt = require('bcrypt');
const { checkUser } = require('./middleware/ifuser');

/* GET users listing. */
router.use(checkUser)

router.get('/', function (req, res, next) {
  res.render('user/land', { user: req.user });
});

router.get('/change-password', function (req, res, next) {
  res.render('user/change', { user: req.user });
});


router.post('/change-password', async function (req, res, next) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.render('user/change', { user: req.user, error: 'All fields are required.' });
  }
  if (newPassword !== confirmNewPassword) {
    return res.render('user/change', { user: req.user, error: 'New passwords do not match.' });
  }

  // Get user from DB
  connection.query('SELECT * FROM users WHERE id = ?', [req.user.id], async (err, results) => {
    if (err || results.length === 0) {
      return res.render('user/change', { user: req.user, error: 'User not found.' });
    }
    const user = results[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.render('user/change', { user: req.user, error: 'Current password is incorrect.' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], (err) => {
      if (err) {
        return res.render('user/change', { user: req.user, error: 'Failed to update password.' });
      }
      res.render('user/change', { user: req.user, success: 'Password changed successfully!' });
    });
  });
});

module.exports = router;
