const mysql = require('mysql');

module.exports = class DatabaseConnection {
    constructor() {
        this.connection = mysql.createConnection({
            host: "scroking.ddns.net",
            user: "marco",
            password: "marcodb",
            database: "AutoScroc"
        });
    }

    connect() {
        this.connection.connect(function (err) {
            if (err) {
                throw new Error(err);
            }
        });
    }

    executeQuery(sql, value) {
        this.connection.query(sql, value)
    }

    closeConnection() {
        this.connection.destroy();
    }
};

