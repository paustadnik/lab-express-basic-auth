const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User.model')
const { render } = require('express/lib/response')
const { route } = require('.')

const router = express.Router()

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const user = new User()
    const hash = await bcrypt.hash(req.body.password, 10)
    user.username = req.body.username
    user.password = hash

    try {
        await user.save()
        res.redirect('/')

    } catch (error) {
        console.log(error)
        res.redirect('/user/signup')
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    console.log(req.session)
    if (user) {
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (isPasswordCorrect) {
            req.session.currentUser = user
            res.redirect('/main')
        } else {
            res.redirect('/user/login')
        }
    } else {
        res.redirect('/user/login')
    }
    console.log(user)
})



module.exports = router