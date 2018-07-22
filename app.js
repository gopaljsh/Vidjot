const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

//Connect to mongodb
mongoose.connect('mongodb://localhost/vidjot-dev', {
})
    .then(() => console.log('Mongodb connected...'))
    .catch(err => console.log(err));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

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

app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
    console.log(`erver started on port ${port}`);
});