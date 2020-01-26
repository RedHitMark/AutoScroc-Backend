const Database = require('./Database');
const Token = require('./token');

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

        loginUser(username, password).then( (token) => {
            res.json({token: token});
        }).catch((errorObject) => {
            res.status(errorObject.status).json({error: errorObject.message});
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

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        if (username && password) {
            const db = new Database();

            const sql = "SELECT id FROM Users WHERE username=? AND password = ?";
            const value = [username, password];

            db.readQuery(sql, value).then((users) => {
                if (users.length === 1) {
                    Token.generateToken(users[0].id).then((token) => {
                        resolve(token);
                    }).catch(() => {
                        reject({status: 300, message: "cannot generate token"});
                    });
                } else {
                    reject({status: 401, message: "wrong username or password"});
                }
            }).catch((sqlError) => {
                reject({status: 501, message: "sql error"});
            }).finally(() => {
                db.close();
            });
        } else {
            reject({status: 400, message: "you should provide all params"});
        }
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
