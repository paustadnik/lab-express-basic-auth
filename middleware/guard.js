const session = require('express-session')

function isLoggedIn (req, res, next) {
    console.log(req.session.currentUser)
    if (!req.session.currentUser) {
        res.redirect('/user/login')
    } else {
        next()
    }
}

module.exports = isLoggedIn