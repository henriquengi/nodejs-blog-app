const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use('/admin', admin)

const port = 8080
app.listen(port, () => {
    console.log('Server running')
})