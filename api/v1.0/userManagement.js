const Database = require('../config/Database');
const Token = require('../config/Token');

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

                const sql = "INSERT INTO Users (name, surname, email, username, password, address, city, region, country, tel, img,  role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const value = [user.name, user.surname, user.email, user.username, user.password, user.address, user.city, user.region, user.country, user.tel, user.img, role];

                db.writeQuery(sql, value)
                    .then((numInserts) => {
                        if (numInserts === 1) {
                            resolve({message: "success"});
                        } else {
                            //500: Internal server error
                            reject({status: 500, message: "failed"});
                        }
                    }).catch((sqlError) => {
                        if (sqlError && sqlError.errno && sqlError.errno === 1062) {
                            //406: Not acceptable
                            reject({status: 406, message: "user already registered"});
                        } else {
                            //500: Internal server error
                            reject({status: 500, message: "generic sql error"});
                        }
                    }).finally(() => {
                        db.close();
                    });
            } else {
                //406: Not acceptable
                reject({status: 406, message: "email not valid"});
            }
        } else {
            //400: Bad request
            reject({status: 400, message: "you should provide all params"});
        }
    });
}

/**
 *
 * @param username : string
 * @param password : string
 * @param uuid : string
 * @returns {Promise<string | Object>}
 */
function login(username, password, uuid) {
    return new Promise((resolve, reject) => {
        if (username && password && uuid) {
            const db = new Database();

            const sql = "SELECT id FROM Users WHERE username=? AND password=?";
            const value = [username, password];

            db.readQuery(sql, value)
                .then((users) => {
                    if (users.length === 1) {
                        Token.generateToken(users[0].id, uuid)
                            .then((token) => {
                                resolve(token);
                            }).catch(() => {
                                //500: Internal server error
                                reject({status: 500, message: "cannot generate token"});
                            });
                    } else {
                        //401: Unauthorized
                        reject({status: 401, message: "wrong username or password"});
                    }
                }).catch((sqlError) => {
                    //500: Internal server error
                    reject({status: 500, message: "sql error"});
                }).finally(() => {
                    db.close();
                });
        } else {
            //400: Bad request
            reject({status: 400, message: "you should provide all params"});
        }
    });
}

/**
 *
 * @param token
 * @param uuid
 * @returns {Promise<string | Object>}
 */
function getUserProfile(token, uuid) {
    return new Promise((resolve, reject) => {
        if (token && uuid) {
            Token.isTokenValid(token, uuid)
                .then(() => {
                    const db = new Database();

                    const sql = "SELECT Users.username, Users.name, Users.surname, Users.email, Users.img, Users.address, Users.city, Users.region, Users.country, Users.tel, Users.role FROM Users INNER JOIN Tokens ON Tokens.user=Users.id WHERE Tokens.token=? AND Tokens.uuid=?";
                    const value = [token, uuid];

                    db.readQuery(sql, value)
                        .then((users) => {
                            if (users.length === 1) {
                                resolve(users[0]);
                            } else {
                                //401: Unauthorized
                                reject({status: 401, message: "token not valid"});
                            }
                        }).catch((sqlError) => {
                            //500: Internal server error
                            reject({status: 500, message: "sql error"});
                        }).finally(() => {
                            db.close();
                        });
                }).catch((invalidTokenMessage) => {
                    //401: Unauthorized
                    reject({status: 401, message: invalidTokenMessage});
                });
        } else {
            //400: Bad request
            reject({status: 400, message: "you should provide all params"});
        }
    });
}

function revalidateUser(token, uuid, secret) {
    return new Promise((resolve, reject) => {
        if (token && uuid && secret) {
            const db = new Database();

            const sql = "SELECT Users.name FROM Users WHERE SHA2(CONCAT(Users.username,Users.email), 512) = ?";
            const value = [secret];
            db.readQuery(sql, value)
                .then((users) => {
                    if (users.length === 1) {
                        Token.refreshToken(token, uuid)
                            .then(()=> {
                                resolve({message : "success"});
                            }).catch((error) => {
                                //500: Internal Server Error
                                reject({status: 500, message: "unable to refresh token"});
                            });
                    } else {
                        //401: Unauthorized
                        reject({status: 401, message: "secret not valid"});
                    }
                }).catch((sqlError) => {
                    //500: Internal server error
                    reject({status: 500, message: "sql error"});
                })
                .finally(() => {
                    db.close();
                });

        } else {
            //400: Bad request
            reject({status: 400, message: "you should provide all params"});
        }
    });
}

function logout(token, uuid) {
    return new Promise((resolve, reject) => {
        if (token && uuid) {
            Token.deleteToken(token, uuid)
                .then(() => {
                    resolve({message : "success"});
                })
                .catch((error) => {
                    reject({status: 500, message: "unable to delete token"});
                })

        } else {
            //400: Bad request
            reject({status: 400, message: "you should provide all params"});
        }
    });
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


module.exports = {
    register,
    login,
    getUserProfile,
    revalidateUser,
    logout
};
