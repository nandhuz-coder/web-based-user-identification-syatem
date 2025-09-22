function checkUser(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function ifAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/users/');
    }
}

module.exports = { checkUser, ifAdmin };