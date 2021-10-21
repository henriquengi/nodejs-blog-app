module.exports = {
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.isAdmin) {
            return next()
        } else {
            req.flash('error_msg', 'Only admin users allowed')
            res.redirect('/')
        }
    }
}