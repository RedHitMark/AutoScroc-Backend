//framework and modules import
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Token = require('./token');


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
    console.log(`Server avviato ed in ascolto all'indirizzo ${address} sulla porta ${port}\nUnix time: ${+new Date()}`);
});

app.post('/login/', require('./login'));
app.post('/register/', require('./register'));

/** TODO: REMOVE this code **/

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

    Token.isTokenValid(token).then((isValid) => {
        if(isValid) {
            res.send(user_id + ' ' + token + ' ' + geo);
        } else {
            res.send('not valid');
        }
    });
});

/** DELETE request */
app.delete('/:nome?', function (req, res) {
    const nome = req.params.nome || 'Sconosciuto';
    res.json({ nome })
});
