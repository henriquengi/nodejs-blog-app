const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Main admin page')
})

router.get('/posts', (req, res) => {
    res.send('Posts page')
})

router.get('/categories', (req, res) => {
    res.send('Category page')
})

module.exports = router