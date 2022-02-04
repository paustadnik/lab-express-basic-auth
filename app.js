// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const session = require('express-session')
const store = require('connect-mongo')

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

const userRouter = require('./routes/user')

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// espress session
app.use(session({
    secret: 'hello',
    resave: true, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 600000,
    },
    store: store.create({
        mongoUrl: 'mongodb://localhost/lab-express-basic-auth'
    })
  }))

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
const isLoggedIn = require('./middleware/guard');
app.use('/', index);

// user routes
app.use('/user', userRouter)

app.get('/main', isLoggedIn, (req, res) => {
    res.render('main')
})

app.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

