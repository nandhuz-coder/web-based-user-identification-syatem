var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('Auth/login', { message: req.flash('error') });
});

module.exports = router;
