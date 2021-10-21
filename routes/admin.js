const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Post')
const Post = mongoose.model('posts')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/categories', (req, res) => {
    Category.find()
        .sort({ date: 'desc' })
        .then((categories) => {
            res.render('admin/categories', { categories: categories })
        })
        .catch((err) => {
            req.flash('error_msg', 'Show categories got an errour, please try again')
            res.redirect('admin')
        })
})

router.get('/categories/add', (req, res) => {
    res.render('admin/addcategory')
})

router.post('/categories/new', (req, res) => {

    var errors = []

    if (!req.body.name || req.body.name == undefined || req.body.name == null) {
        errors.push({ text: 'Invalid name' })
    }

    if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: 'Invalid slug' })
    }

    if (req.body.name.length < 2) {
        errors.push({ text: 'Category name too short' })
    }

    if (errors.length > 0) {
        res.render('admin/addcategory', { errors: errors })
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save()
            .then(() => {
                req.flash('success_msg', 'Category created')
                res.redirect('/admin/categories')
            })
            .catch(() => {
                req.flash('error_msgn', 'There was an error on category creation, try again')
                res.redirect('/admin')
            })
    }
})

router.get('/category/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id })
        .then((result) => {
            res.render('admin/editcategory', { category: result })
        })
        .catch(() => {
            req.flash('error_msg', 'Category doesnt exist')
            res.redirect('/admin/categories')
        })
})

router.post('/category/edit', (req, res) => {

    Category.findOne({ _id: req.body.id })
        .then((category) => {
            var errors = []

            if (!req.body.name || req.body.name == undefined || req.body.name == null) {
                errors.push({ text: 'Invalid name' })
            }

            if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
                errors.push({ text: 'Invalid slug' })
            }

            if (req.body.name.length < 2) {
                errors.push({ text: 'Category name too short' })
            }

            if (errors.length > 0) {
                res.render('admin/editcategory', { errors: errors, category: category })
            } else {

                category.name = req.body.name
                category.slug = req.body.slug
                category.save()
                    .then(() => {
                        req.flash('success_msg', 'Category edited')
                        res.redirect('/admin/categories')
                    })
                    .catch((err) => {
                        req.flash('error_msg', 'Error saving category')
                        res.redirect('/admin/category/edit/' + req.body.id)
                    })
            }
        })
        .catch(() => {
            req.flash('error_msg', 'Error updating category')
            res.redirect('/admin/category/edit/' + req.body.id)
        })
})

router.post('/category/remove', (req, res) => {
    Category.remove({ _id: req.body.id })
        .then(() => {
            req.flash('success_msg', 'Category removed')
            res.redirect('/admin/categories')
        })
        .catch(() => {
            req.flash('error_msg', 'Error deleting category')
            res.redirect('/admin/categories')
        })
})

router.get('/posts', (req, res) => {

    Post.find().populate('category').sort({ date: 'desc' }).then((result) => {
        res.render('admin/posts', { posts: result })
    }).catch(() => {
        req.flash('error_msg', 'Error getting posts')
        res.redirect('/admin')
    })

})

router.get('/post/add', (req, res) => {
    Category.find().then((result) => {

        res.render('admin/addpost', { categories: result })
    }).catch(() => {
        req.flash('error_msg', 'Error getting categories')
        res.redirect('/admin')
    })
})

router.post('/post/new', (req, res) => {
    let errors = []

    if (req.body.category == "0") {
        errors.push({ text: 'Invalid category' })
    }

    if (errors.length > 0) {
        req.flash('error_msg', 'Error getting categories')
        res.redirect('/admin/add')
    } else {
        const newPost = {
            title: req.body.title,
            desctiption: req.body.description,
            contend: req.body.content,
            category: req.body.category,
            slug: req.body.slug,
        }

        new Post(newPost).save()
            .then(() => {
                req.flash('success_msg', 'Post created')
                res.redirect('/admin/posts')
            })
            .catch(() => {
                req.flash('error_msg', 'Error creating post')
                res.redirect('/admin/posts/add')
            })
    }
})

router.post('/post/edit/', (req, res) => {

    Post.findOne({ _id: req.body.id })
        .then((post) => {
            post.title = req.body.title,
                post.slug = req.body.slug,
                post.desctiption = req.body.desctiption,
                post.contend = req.body.contend,
                post.category = req.body.category

            post.save()
                .then(() => {
                    req.flash('success_msg', 'Post edited')
                    res.redirect('/admin/posts')
                })
                .catch(() => {
                    req.flash('error_msg', 'Error saving edited post')
                    res.redirect('/admin/posts')
                })
        })
        .catch((err) => {
            req.flash('error_msg', 'Error editing edit')
            res.redirect('/admin/posts')
        })
})

router.get('/post/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then((resultPost) => {
            Category.find()
                .then((resultCat) => {
                    res.render('admin/editpost', { categories: resultCat, post: resultPost })
                })
                .catch(() => {
                    req.flash('error_msg', 'Error finding categories')
                    res.redirect('/admin/posts')
                })
        })
        .catch(() => {
            req.flash('error_msg', 'Error finding post')
            res.redirect('/admin/posts')
        })
})

module.exports = router