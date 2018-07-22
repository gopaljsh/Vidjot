const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureIsAuthenticated} = require('../helper/auth');

require('../models/Idea');
const Idea = mongoose.model('ideas');

//Add ideas route
router.get('/add', ensureIsAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit ideas route
router.get('/edit/:id', ensureIsAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if(idea.user != req.user.id) {
                res.redirect('/ideas')
            } else {
                res.render('ideas/edit', {
                    idea:idea
                });
            }
        })
});

//Edit ideas route
router.put('/:id', ensureIsAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                });
        })
});

//Delete ideas
router.delete('/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/ideas');
        })
});

//Show ideas route
router.get('/', ensureIsAuthenticated, (req, res) => {
    Idea.find({
        user: req.user.id
    })
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
    
});

//Ideas route
router.post('/', ensureIsAuthenticated, (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }

    if(!req.body.details) {
        errors.push({
            text: 'Please add a details'
        });
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            });
    }
});

module.exports = router;