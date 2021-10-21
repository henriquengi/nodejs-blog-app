const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model('users', User)