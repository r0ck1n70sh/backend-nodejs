const express = require('express');
const session = require('express-session');

const {join} = require('path');

const accounts = require('./accounts');

const app = express();
const PORT = 3000;
const __dirViews = join(__dirname, '/views');

app.use('/accounts', accounts);

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.static('templates'));

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

// app.use(session({
//     secret: 'user & pass',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         secure: true,
//         maxAge: 1000 * 60 * 60 * 1
//     },
//     loggedIn: false,
//     username: ''
// }));

app.get('/', (req, res) => {
    // const {username} = req.session.username | null;
    // console.log(req.session);

    // if(req.session.loggedIn == true)
    //     res.render(
    //         join(__dirViews, '/home'),
    //         {
    //             user: {
    //                 username: username,
    //                 password: undefined
    //             },
    //             status: undefined
    //         }
    //     );
    
    res.redirect('/accounts/login');
});


app.listen(PORT, () => {
    console.log(`Currently listening at http://localhost:${PORT}`);
});