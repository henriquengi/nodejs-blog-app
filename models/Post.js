const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    desctiption: {
        type: String,
        require: true
    },
    contend: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectID,
        ref: 'categories',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('posts', Postagem)