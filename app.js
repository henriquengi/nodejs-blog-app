const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
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

app.use('/admin', admin)

const port = 8080
app.listen(port, () => {
    console.log('Server running')
})