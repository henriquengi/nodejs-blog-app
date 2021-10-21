const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const user = require('./routes/user')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Post')
const Post = mongoose.model('posts')
require('./models/Category')
const Category = mongoose.model('categories')
const passport = require('passport')
require('./config/auth')(passport)

app.use(session({
    secret: 'nodecourse',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
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

app.get('/', (req, res) => {
    Post.find()
        .populate('category')
        .sort({ date: 'desc' })
        .then((result) => {
            res.render('index', { posts: result })
        })
        .catch(() => {
            req.flash('error_msg', 'Internal error')
            res.redirect('/404')
        })

})

app.get('/post/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((result) => {
            if (result) {

                res.render('posts/index', { post: result })
            } else {
                req.flash('error_msg', 'Post doesnt exist')
                res.redirect('/')
            }
        })
        .catch(() => {
            req.flash('error_msg', 'Couldnt open post, try again')
            res.redirect('/')
        })
})

app.use('/admin', admin)

app.use('/user', user)

app.get('/categories', (req, res) => {
    Category.find()
        .then((result) => {
            res.render('categories/index', { categories: result })
        })
        .catch(() => {
            req.flash('error_msg', 'Error getting categories')
            res.redirect('/')
        })
})

app.get('/category/:slug', (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .then((result) => {
            if (result) {
                Post.find({ category: result._id })
                    .then((posts) => {
                        res.render('categories/posts', { posts: posts, category: result })
                    })
                    .catch(() => {
                        req.flash('error_msg', 'Error listing posts')
                        res.redirect('/categories')
                    })
            } else {
                req.flash('error_msg', 'Category doesnt exist')
                res.redirect('/categories')
            }
        })
        .catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Internal error occurred trying to get categories')
            res.redirect('/categories')
        })
})

app.get('/404', (req, res) => {
    res.send('Erro 404!')
})

const port = 8080
app.listen(port, () => {
    console.log('Server running')
})