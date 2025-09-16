function roleRedirect(req, res, next) {
    if (!req.user) {
        return res.redirect('/');
    }
    if (req.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    } else {
        return res.redirect('/users/');
    }
}

module.exports = roleRedirect;