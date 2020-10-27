// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
    res.render('layout', {
        name: "index"
    });
});

app.get('/login', function (req, res) {
    res.render('layout', {
        name: "login"
    });
});

app.get('/devices', function (req, res) {
    res.render('layout', {
        name: "devices"
    });
});

app.get('/events', function (req, res) {
    res.render('layout', {
        name: "events"
    });
});

app.get('/users', function (req, res) {
    res.render('layout', {
        name: "users"
    });
});

app.use(express.static('public'));

app.listen(8080);
console.log('8080 is the magic port');