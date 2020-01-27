//framework and modules import
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Token = require('./Token');


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
    console.log(`Server avviato ed in ascolto all'indirizzo ${address} sulla porta ${port}\n il server è stato acceso al secondo: ${+new Date()}`);
});


const userManagement = require('./userManagement');

/** USER LOGIN API END-POINT**/
app.post('/login/', (req, res) => {
    userManagement.login(req, res);
});

/** USER REGISTER API END-POINT**/
app.post('/register/', (req, res) => {
    userManagement.registerUser(req, res);
});

/** ADMIN REGISTER API END-POINT**/
app.post('/register_admin/', (req, res) => {
    userManagement.registerAdmin(req, res);
});



const rentManagement = require('./rentManagement');
/** RENT **/
app.get('/rent/page/:idPage', (req, res) => {
    const idPage = req.params.idPage || 1;
    rentManagement.getAll(req, res, idPage);
});
/*
app.get('/rent/:id', require('./rent'));
app.post('/rent/', require('./rent'));
app.put('/rent/:id', require('./rent'));
app.delete('/rent/:id', require('./rent'));
*/

/** TODO: REMOVE this code **/

/**
 * GET request
 * @url '/'
 */
app.get('/', function (req, res) {
    req.session.view++;
    res.send(`Ciao da Express!!!`);
});

/**
 * GET request
 * @url '/:nome?'
 */
app.get('/:nome?', function (req, res) {
    const nome = req.params.nome || 'Sconosciuto';
    res.json({ nome })
});

/** POSTrequest */
app.post('/' , function(req, res) {
    const user_id = req.body.id;
    const token = req.body.token;
    const geo = req.body.geo;
    res.send(user_id);
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
