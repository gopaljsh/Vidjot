const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

require('../models/User');
const Users = mongoose.model('users')

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({ text: `Password doesn't match` });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: `Password must be of atleast 4 character` });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        var test = Users.findOne({
            email: req.body.email
        })  
            .then(user => {
                if (user) {
                    //errors.push({text: 'test'})
                    res.redirect('/users/login');
                } else {
                    const newUser = new Users({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    res.redirect('/users/login')
                                })
                                .catch(err => {
                                    console.log(err)
                                    return
                                })
                        });
                    });
                }
            })

    }
});

module.exports = router;