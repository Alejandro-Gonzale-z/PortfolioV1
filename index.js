const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const { spawn } = require('child_process');
const { exit } = require('process');
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));
dotenv.config();

var Loginbool = false;

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

function authenticated(username, password){
    const usernameENV = process.env.usernameENV;
    const passwordENV = process.env.passwordENV;

    if (username == usernameENV && passwordENV == password){
        return true;
    } else{
        return false;
    }
};

function runPythonScript(scriptPath, args, callback){
    return new Promise((resolve,reject) => {
        const pyProg = spawn('./venv/Scripts/python.exe', [scriptPath]);

        let data = '';
        pyProg.stdout.on('data', (stdout) => {
            data += stdout.toString();
        });

        pyProg.stderr.on('data', (stderr) => {
            console.log(`stderr: ${stderr}`);
        });

        pyProg.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            console.log(data);
            callback(code);
        });
    });
}

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', function (req,res) {
    Loginbool = false;
    res.sendFile(__dirname + '/login.html');
});

app.get('/google-work-auto', function(req,res) {
    if (Loginbool){
        res.sendFile(__dirname + '/calendar.html');
    } else{
        res.redirect('/login');
    }
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticated(username,password)) {
        Loginbool = true;
        res.redirect('/google-work-auto');
    } else{
        Loginbool = false;
        res.redirect("/login");
    }
});

app.post('/create-schedule', async (req, res) => {
    try{
        const result = runPythonScript('./python/app.py', null, (exitCode) => {
            res.send(exitCode.toString());
            console.log('Exit Code:', exitCode);
        });
    } catch (error) {
        console.log(error);
    }
})

var server = app.listen(PORT, function(){
    console.log("Express app running at localhost:3000");
})