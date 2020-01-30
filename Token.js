const Database = require('./Database');

module.exports = {
    generateToken: (userid, uuid) => {
        return new Promise((resolve, reject) => {
            const token = getRandomString(20);

            insertToken(token, uuid, userid).then(() => {
                resolve(token);
            }).catch((err) => {
                reject()
            });
        });
    },
    isTokenValid: (token, uuid) => {
        return new Promise((resolve, reject) => {
            retriveTokenTimestamp(token).then((timestamp) => {
                console.log(timestamp);
                console.log(+new Date());
                console.log(+new Date() - timestamp);

                if( Math.abs(+new Date() - timestamp) <= 600000) {//10 minutes
                    updateTokenTimestamp(token, uuid);
                    resolve();
                }
                reject();
            }).catch((err) => {
                reject();
            });
        });
    },
    refreshToken: (token, uuid) => {
        //@TODO Manage this
        updateTokenTimestamp(token, uuid);
    }
};


function insertToken(token, uuid, userid) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "INSERT INTO Tokens (token, uuid, user, timestamp) VALUES (?, ?, ?, ?)";
        const value = [token, uuid, userid, +new Date()];

        db.writeQuery(sql, value).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            db.close();
        });
    });
}

function retriveTokenTimestamp(token, uuid) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT timestamp FROM Tokens WHERE token = ? AND uuid = ?";
        const value = [token, uuid];

        db.readQuery(sql, value).then((result) => {
            resolve(result[0].timestamp);
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            db.close();
        });
    });
}

function getRandomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?@#$%^&*()_';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function updateTokenTimestamp(token, uuid) {
    const db = new Database();

    const sql = "UPDATE Tokens SET timestamp=? WHERE token = ? AND uuid = ?";
    const value = [+new Date.now(), token, uuid];

    db.writeQuery(sql, value).then((result) => {
        if(result === 1) {
            resolve();
        }
        reject('cannot refresh');
    }).catch((err) => {
        reject(err);
    }).finally(() => {
        db.close();
    });
}
