const express = require('express');
const http = require('http');

const app = express();

const server = http.createServer(app);


const url = require('url');
const utils = require('./utils');

app.get('/', function (req, res) {
    res.send('Ciao da Express!!!');
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

const SERVER_PORT = 6999 || process.env.PORT;
const HOST = '0.0.0.0' || process.env.HOST;

server.listen(SERVER_PORT, HOST, function () {
    const host = server.address().address;
    const port = server.address().port;
    const address = `http://${host}:${port}`;
    console.log(`Server avviato ed in ascolto all'indirizzo: ${address} sulla porta ${port}`);
});
