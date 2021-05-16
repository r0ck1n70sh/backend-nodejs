const express = require('express');
const session = require('express-session');
const router = express.Router();

const auth = require('./pkg/auth');
const addUser = require('./pkg/addUser')

const {join} = require('path');
const __dirViews = join(__dirname, '/views');

router.use(express.static('static'));

router.use(
    express.urlencoded({
        extended: true
    })
);
router.use(express.json());

router.use(session({
    secret: 'user & pass',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 1
    },
    loggedIn : false,
    user: {}
}));

router.get('/dashboard', (req, res) => {
    const user = req.session.user || {};
    
    if(req.session.loggedIn == true)
        res.render(
            join(__dirViews, '/home'),
            {
                user: user,
                status: 'completed'
            }
        );
    else 
        res.redirect('/accounts/login');
});

router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/accounts/dashboard');
    } else { 
        res.render(join(__dirViews, '/login'));
    }
});

router.get('/signup', (req, res) => {
    res.render(join(__dirViews, '/signup'));
});

router.post('/auth', async (req, res) => {
    const {username, password} = req.body;
    
    const {status} = await auth.authorize({
        username: username,
        password: password
    });

    console.log(`status: ${status}`);
    if(status == 'completed'){
        req.session.loggedIn = true;
        req.session.user = {
            username: username,
            password: password
        };
        console.log(req.session);
        res.redirect('/accounts/dashboard');
    }
    else{
        console.log('auth failure!');
        res.redirect('/accounts/login/');
    }
});

router.post('/newUser', async (req, res) => {
    const user = req.body;
    const {status: status1} = await addUser.authorize(user);

    if(status1 === 'completed'){
        const {status: status2} = await auth.authorize({
            username: user.username,
            password: user.password
        })

        res.render(
            join(__dirViews, '/home'),
            {
                user: user,
                status: `${status1}, ${status2}`
            }
        )

        // res.redirect('/accounts/auth');
    }

    else
        res.render(
            join(__dirViews, '/home'),
            {
                user: user,
                status: status1
            }
        )
});

// console.log(typeof session.Session);
module.exports = {router, session};