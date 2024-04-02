const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));
dotenv.config();

function authenticated(username, password){
    const usernameENV = process.env.usernameENV;
    const passwordENV = process.env.passwordENV;

    if (username == usernameENV && passwordENV == password){
        return true;
    } else{
        return false;
    }
}

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', function (req,res) {
    res.sendFile(__dirname + '/login.html');
})

app.get('/calendar', function(req,res) {
    res.sendFile(__dirname + '/calendar.html');
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticated(username,password)) {
        res.redirect("/calendar");
    } else{
        res.redirect("/");
    }
});

var server = app.listen(PORT, function(){
    console.log("Express app running at localhost:3000");
    console.log(__dirname);
})