const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Post')
const Post = mongoose.model('posts')

app.use(session({
    secret: 'nodecourse',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({
    defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('view engine', 'handlebars')

mongoose.mongo.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp')
    .then(() => {
        console.log('DB connected')
    })
    .catch((err) => {
        console.log('Error connectiong to database: ' + err)
    })

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) => {
    Post.find()
    .populate('category')
    .sort({date: 'desc'})
    .then((result) => {
        res.render('index', {posts: result})
    })
    .catch(() => {
        req.flash('error_msg', 'Internal error')
        res.redirect('/404')
    })
    
})

app.use('/admin', admin)

app.get('/404', (req, res) => {
    res.send('Erro 404!')
})

const port = 8080
app.listen(port, () => {
    console.log('Server running')
})