//const mysql = require('mysql');
const DatabaseConnection = require('./DatabaseConnection');

module.exports = function (req, res) {

    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const city = req.body.city;
    const region = req.body.region;
    const country = req.body.country;
    const tel = req.body.tel;


    if (name && surname && email && username && password && address && city && region && country && tel) {
        if (isMailValid(email)) {
            const db = DatabaseConnection.getConnection();

            const sql = "INSERT INTO Users (name, surname, email, username, password, address, city, region, country, tel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const value = [name, surname, email, username, password, address, city, region, country, tel];

            //@TODO gestore errori my sql
            db.query(sql, value, (err, result) => {
                if(err) {
                    res.json({message : 'cannot register'});
                }

                res.json({message : 'success'});
            });

            db.end();
        }
    } else {
        res.status(400).json( {error: "you should provide all params"} );
    }
};

function isMailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
