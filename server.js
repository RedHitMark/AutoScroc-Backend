//framework and modules import
const express = require('express');
const http = require('http');
//const url = require('url');
const utils = require('./utils');

//create a new express application
const app = express();

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
    console.log(`Server avviato ed in ascolto all'indirizzo: ${address} sulla porta ${port}`);
});

/**
 * Get request
 * @url '/'
 */
app.get('/', function (req, res) {
    res.send('Ciao da Express!!!');
});

/**
 * Get request
 * @url '/:nome?'
 */
app.get('/:nome?', function (req, res) {
    const nome = req.params.nome || 'Sconosciuto';
    res.json({ nome })
});


/*async function onRequest(request, response) {
    try {
        let client_ip = utils.getClientAddress(request);
        let url_obj = url.parse(request.url, true);
        let query_params = url_obj.query;
        let path_name = url_obj.pathname;

        console.log("Richiesta ricevuta da: " + client_ip);

        await chaincode.init();

        switch (path_name) {
            case "/login":
                break;

            case "/registration":
                break;

            default:
                let json_response = {
                    message: "Not found",
                };

                //Not found
                response.writeHead(404, {"Content-Type": "text/json"});
                response.write(JSON.stringify(json_response));
                response.end();
                break;
        }
    } catch (e) {
        let json_response = {
            message: "Errore del server",
            verbose: e.message
        };

        //Internal Server Rrror
        response.writeHead(500, {"Content-Type": "text/json"});
        response.write(JSON.stringify(json_response));
        response.end();
    }
}*/






