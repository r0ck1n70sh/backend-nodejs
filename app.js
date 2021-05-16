const express = require('express');
const {join} = require('path');

const accounts = require('./accounts');

const app = express();
const PORT = 3000;
const __dirViews = join(__dirname, '/views');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.static('templates'));

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

app.use(require('express-session')({
    secret: 'user & pass'
}));
app.use('/accounts', accounts.router);

app.use((req, res, next) => {
    console.log(`${req.url} rendered ${Date.now().toLocaleString()}` );
    next();
});

app.get('/', (req, res) => {
    const {username} = req.session.user || 'NA';

    if(!req.session.loggedIn)
        res.redirect('/accounts/login');
    else 
        res.render(
            join(__dirViews, '/home'), 
            {
                user: {
                    username: username,
                    password: 'NA'
                },
                status: 'NA'
            }
        );
});


app.listen(PORT, () => {
    console.log(`Currently listening at http://localhost:${PORT}`);
});