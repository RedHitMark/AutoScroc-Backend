const Database = require('./Database');
const Token = require('./Token');

module.exports = {
    registerUser: (req, res) => {
        const user = getUserRegistrationFromHTTPBody(req);

        register(user, 'user').then((jsonSuccess) => {
            res.json(jsonSuccess);
        }).catch((errorObject) => {
            res.status(errorObject.status).json({error: errorObject.message});
        });
    },
    registerAdmin: (req, res) => {
        const user = getUserRegistrationFromHTTPBody(req);

        register(user, 'admin').then((jsonSuccess) => {
            res.json(jsonSuccess);
        }).catch((errorObject) => {
            res.status(errorObject.status).json({error: errorObject.message});
        });
    },
    login: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const uuid = req.body.uuid;

        loginUser(username, password, uuid).then( (token) => {
            res.json({token: token});
        }).catch((errorObject) => {
            res.status(errorObject.status).json({error: errorObject.message});
        });
    },
    getProfile: (req, res) => {
        const token = req.body.token;
        const uuid = req.body.uuid;

        Token.isTokenValid(token).then(() => {
            getUserProfile(token, uuid).then((user) => {
                res.json(user);
            }).catch((errorObject) => {
                res.status(errorObject.status).json({error: errorObject.message});
            });
        }).catch(() => {
            //401: Unauthorized
            res.status(401).json({error: errorObject.message});
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
                        resolve({message: "success"});
                    }

                    //500: Internal server error
                    reject({status: 500, message: "failed"});
                }).catch((sqlError) => {
                    if (sqlError && sqlError.errno && sqlError.errno === 1062) {
                        //406: Not acceptable
                        reject({status: 406, message: "user already registered"});
                    }

                    //500: Internal server error
                    reject({status: 500, message: "generic sql error"});
                }).finally(() => {
                    db.close();
                });
            }
            //406: Not acceptable
            reject({status: 406, message: "email not valid"});
        }

        //400: Bad request
        reject({status: 400, message: "you should provide all params"});
    });
}

/**
 *
 * @param username : string
 * @param password : string
 * @param uuid : string
 * @returns {Promise<string | Object>}
 */
function loginUser(username, password, uuid) {
    return new Promise((resolve, reject) => {
        if (username && password && uuid) {
            const db = new Database();

            const sql = "SELECT id FROM Users WHERE username=? AND password=?";
            const value = [username, password];

            db.readQuery(sql, value).then((users) => {
                if (users.length === 1) {
                    Token.generateToken(users[0].id, uuid).then((token) => {
                        resolve(token);
                    }).catch(() => {
                        //500: Internal server error
                        reject({status: 500, message: "cannot generate token"});
                    });
                }

                //401: Unauthorized
                reject({status: 401, message: "wrong username or password"});
            }).catch((sqlError) => {
                //500: Internal server error
                reject({status: 500, message: "sql error"});
            }).finally(() => {
                db.close();
            });
        }

        //400: Bad request
        reject({status: 400, message: "you should provide all params"});
    });
}


function getUserProfile(token, uuid) {
    return new Promise((resolve, reject) => {
        if (token && uuid) {
            Token.isTokenValid(token, uuid).then(() => {
                const db = new Database();

                const sql = "SELECT Users.name, Users.surname, Users.email, Users.role FROM Users INNER JOIN Tokens ON Tokens.user=Users.id WHERE Tokens.token=? AND Tokens.uuid=?";
                const value = [token, uuid];

                db.readQuery(sql, value).then((users) => {
                    if (users.length === 1) {
                        resolve(users[0]);
                    }

                    //401: Unauthorized
                    reject({status: 401, message: "token not valid"});
                }).catch((sqlError) => {
                    //500: Internal server error
                    reject({status: 500, message: "sql error"});
                }).finally(() => {
                    db.close();
                });
            }).catch(() => {
                //401: Unauthorized
                reject({status: 401, message: "token expired"});
            });
        }

        //400: Bad request
        reject({status: 400, message: "you should provide all params"});
    });
}


/**
 * @param req : object of http request body
 */
function getUserRegistrationFromHTTPBody(req) {
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
