const mysql = require('mysql');

module.exports = {
    getConnection : function() {
        const connection = mysql.createConnection({
            host: "scroking.ddns.net",
            user: "marco",
            password: "marcodb",
            database: "AutoScroc"
        });

        connection.connect(function (err) {
            if (err) {
                throw err;
            }
        });

        return connection
    }
};

