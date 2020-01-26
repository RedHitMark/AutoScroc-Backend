const Database = require('./Database');

module.exports = {
    registerUser: (req, res) => {
        const user = getUserFromHTTPBody(req);

        register(user, 'user').then( (jsonSuccess) => {
            res.json(jsonSuccess);
        }).catch( (errorObject) =>{
            res.status(errorObject.status).json({ error : errorObject.message } );
        });
    },
    registerAdmin: (req, res) => {
        const user = getUserFromHTTPBody(req);

        register(user, 'admin').then( (jsonSuccess) => {
            res.json(jsonSuccess);
        }).catch( (errorObject) =>{
            res.status(errorObject.status).json({ error : errorObject.message });
        });
    }
};

/**
 * @param user : object of user parmas
 * @param role : string role of user to register
 * @
 */
function register(user, role) {
    return new Promise((resolve, reject) => {
        if (user.name && user.surname && user.email && user.username && user.password && user.address && user.city && user.region && user.country && user.tel) {
            if (isMailValid(user.email)) {
                const db = new Database();

                const sql = "INSERT INTO Users (name, surname, email, username, password, address, city, region, country, tel, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const value = [user.name, user.surname, user.email, user.username, user.password, user.address, user.city, user.region, user.country, user.tel, role];

                db.writeQuery(sql, value).then((result) => {
                    if (result === 1) {
                        resolve({message: "success"} );
                    } else {
                        reject({status: 401, message: "failed"});
                    }
                }).catch((sqlError) => {
                    if (sqlError && sqlError.errno && sqlError.errno === 1062) {
                        reject({status: 401, message: "user already registered"});
                    } else {
                        reject({status: 501, message: "generic sql error"});
                    }

                }).finally(() => {
                    db.close();
                });
            } else {
                reject({status: 400, message: "email not valid"});
            }
        } else {
            reject({status: 400, message: "you should provide all params"});
        }
    });
}



/**
 * @param req : object of http request body
 */
function getUserFromHTTPBody(req) {
    return {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        region: req.body.region,
        country: req.body.country,
        tel: req.body.tel
    };
}

/**
 * Check if a mail is formatted correctly
 *
 * @param email : string of mail to check
 * @returns {boolean} : true if email is correct, false otherwise
 */
function isMailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
