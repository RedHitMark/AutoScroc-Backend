//framework and modules import
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Token = require('./api/config/Token');


//create a new express application
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//create a new http server
const SERVER_PORT = 6999 || process.env.PORT;
const SERVER_HOST = '0.0.0.0' || process.env.HOST;
const server = http.createServer(app);

//load all routers
const routes = require('./api/routes')(app);

//fall back
app.use((req, res) => {
    res.status(404);
});


/**
 * Bind server to SERVER_PORT and SERVER_HOST
 */
server.listen(SERVER_PORT, SERVER_HOST, function () {
    const host = server.address().address;
    const port = server.address().port;
    const address = `http://${host}:${port}`;
    console.log(`Server avviato ed in ascolto all'indirizzo ${address} sulla porta ${port}\n il server è stato acceso al secondo: ${+new Date()}`);
});
