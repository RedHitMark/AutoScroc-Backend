const Database = require('./Database');

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
    const role = req.body.role;


    if (name && surname && email && username && password && address && city && region && country && tel && role) {
        if (isMailValid(email)) {
            const db = new Database();

            const sql = "INSERT INTO Users (name, surname, email, username, password, address, city, region, country, tel, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const value = [name, surname, email, username, password, address, city, region, country, tel, role];

            db.writeQuery(sql, value).then( (result) => {
                if(result === 1) {
                    res.json( {error: "success"} );
                } else {
                    res.status(401).json( {error: "failed"} );
                }
            }).catch( (sqlError) => {
                //sql error
                if (sqlError && sqlError.errno &&  sqlError.errno === 1062) {
                    res.status(401).json( {error: "user already registered"} )
                } else {
                    res.status(501).json( {error: "generic sql error"} );
                }
                console.log(sqlError);

            }).finally(() => {
                db.close();
            });
        }
    } else {
        res.status(400).json( {error: "you should provide all params"} );
    }
};

function isMailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
