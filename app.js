const express = require('express');
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

app.get('/', (req, res) => {
    const {username, password, status} = req.body;

    res.render(
        join(__dirViews, '/home'), 
        {
            user: {
                username: username,
                password: password
            },
            status: status
        }
    );
    console.log('Home rendered!');
});


app.listen(PORT, () => {
    console.log(`Currently listening at http://localhost:${PORT}`);
});