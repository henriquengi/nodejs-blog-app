const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const User = mongoose.model('users')

module.exports = (passport) => {


    passport.use(new localStrategy({usernameField: 'mail'}, (mail, password, done) => {
        User.findOne({mail: mail})
        .then((user) => {
            if(!user) {
                return done(null, false, {message: 'This account doesnt exist'})
            } 
            
            bcrypt.compare(password, user.password, (err, match) => {
                if(match) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Invelid password'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}