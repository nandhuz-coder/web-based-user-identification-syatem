function roleRedirect(req, res, next) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    if (req.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    } else {
        return res.redirect('/user/dashboard');
    }
}

module.exports = roleRedirect;