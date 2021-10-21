const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {
    let errors = []

    if (!req.body.username || typeof req.body.username == undefined || req.body.username == null) {
        errors.push({ text: 'Invalid username' })
    }

    if (!req.body.mail || typeof req.body.mail == undefined || req.body.mail == null) {
        errors.push({ text: 'Invalid mail' })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ text: 'Invalid password' })
    }

    if (req.body.username.length < 4) {
        errors.push({ text: 'Username too short' })
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Password too short' })
    }

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password mismatch' })
    }

    if (errors.length > 0) {
        res.render('user/register', { errors: errors })
    } else {
        User.findOne({ mail: req.body.mail })
            .then((result) => {
                if (result) {
                    req.flash('error_msg', 'Email already in use')
                    res.redirect('/user/register')
                } else {
                    const newUser = new User({
                        username: req.body.username,
                        mail: req.body.mail,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash('error_msg', 'There was an error during registration, please try again')
                                res.redirect('/user/register')
                            } else {
                                newUser.password = hash

                                newUser.save()
                                    .then(() => {
                                        req.flash('success_msg', 'Account created')
                                        res.redirect('/')
                                    })
                                    .catch(() => {
                                        req.flash('error_msg', 'There was an error during registration, please try again')
                                        res.redirect('/user/register')
                                    })
                            }
                        })
                    })
                }
            })
            .catch(() => {
                req.flash('error_msg', 'Internal error')
                res.redirect('/')
            })
    }


})

module.exports = router