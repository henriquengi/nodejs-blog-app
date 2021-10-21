const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Posts page')
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

module.exports = router