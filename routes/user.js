const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {
    let errors = []

    if(!req.body.username || typeof req.body.username == undefined || req.body.username == null) {
        errors.push({text: 'Invalid username'})
    }

    if(!req.body.mail || typeof req.body.mail == undefined || req.body.mail == null) {
        errors.push({text: 'Invalid mail'})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({text: 'Invalid password'})
    }

    if(req.body.username.length < 4 ) {
        errors.push({text: 'Username too short'})
    }

    if(req.body.password.length < 4 ) {
        errors.push({text: 'Password too short'})
    }

    if(req.body.password != req.body.password2) {
        errors.push({text: 'Password mismatch'})
    }

    if (errors.length > 0) {
        res.render('user/register', {errors: errors})
    } else {

    }


})

module.exports = router