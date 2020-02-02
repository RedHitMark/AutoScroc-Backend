const mysql = require('mysql');

module.exports = class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "scroking.ddns.net",
            user: "marco",
            password: "marcodb",
            database: "AutoScroc"
        });

        this.connection.connect(function (err) {
            if (err) {
                throw err;
            }
        });
    }

    async writeQuery(sql, value) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, value,  async (err, result) => {
                if (err) reject(err);

                resolve(result.affectedRows);
            });
        });
    }

    async readQuery(sql, value) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, value,  async (err, result) => {
                if (err) reject(err);

                resolve(result);
            });
        });
    }

    close() {
        this.connection.end();
    }
};
