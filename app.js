const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Connect to mongodb
mongoose.connect('mongodb://localhost/vidjot-dev', {
})
    .then(() => console.log('Mongodb connected...'))
    .catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'))

//Handlebar Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Index route
app.get('/', (req, res) => {
    res.render('index',{
        title: 'Welcome'
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Add ideas route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit ideas route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea:idea
            });
        })
});

//Edit ideas route
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/ideas');
        })
});

//Show ideas route
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
    
});

//Ideas route
app.post('/ideas', (req, res) => {
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
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            });
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`erver started on port ${port}`);
});