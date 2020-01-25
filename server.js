//framework and modules import
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const DatabaseConnection = require('./DatabaseConnection');
const utils = require('./utils');


//create a new express application
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

//create a new http server
const SERVER_PORT = 6999 || process.env.PORT;
const SERVER_HOST = '0.0.0.0' || process.env.HOST;
const server = http.createServer(app);

/**
 * Bind server to SERVER_PORT and SERVER_HOST
 */
server.listen(SERVER_PORT, SERVER_HOST, function () {
    const host = server.address().address;
    const port = server.address().port;
    const address = `http://${host}:${port}`;
    console.log(`Server avviato ed in ascolto all'indirizzo ${address} sulla porta ${port}`);
});

app.post('/register/', function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const city = req.body.city;
    const region =  req.body.region;
    const country =  req.body.country;
    const tel = req.body.tel;


    if (name && surname && email && username && password && address && city && region && country && tel) {
        const db = new DatabaseConnection();
        db.connect();

        const sql = "INSERT INTO Users (name, surname, email, username, password, address, city, region, country, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const value = [name, surname, email, username, password, address, city, region, country, tel];

        db.executeQuery(sql, value);

        db.closeConnection();

        res.send("registrato con successo");

    } else {
        res.status(400).json({
            error : "you should provide all params"
        });
    }
});


app.post('/register-test/', function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;



    if (username && password) {
        const db = new DatabaseConnection();
        db.connect();

        const sql = "INSERT INTO Users (name, surname, email, username, password, address, region, country, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const value = ['John', 'Highway 71', 'Highway 71', username, password, 'Highway 71','Highway 71', 'Highway 71', 'Highway 71'];

        db.executeQuery(sql, value);

        db.closeConnection();

        const message = 'success';
        res.json( { message } );
    } else {
        const message = 'you should provide all params';
        res.status(400).json({message});
    }
});


/**
 * GET request
 * @url '/'
 */
app.get('/', function (req, res) {
    req.session.view++;
    res.send(`Ciao da Express!!! ${req.session.view}`);
});

/**
 * GET request
 * @url '/:nome?'
 */
app.get('/:nome?', function (req, res) {
    const nome = req.params.nome || 'Sconosciuto';
    res.json({ nome })
});

/** POST request */
app.post('/' , function(req, res) {
    const user_id = req.body.id;
    const token = req.body.token;
    const geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});

/** DELETE request */
app.delete('/:nome?', function (req, res) {
    const nome = req.params.nome || 'Sconosciuto';
    res.json({ nome })
});








