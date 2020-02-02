const Database = require('./Database');

async function generateToken(userid, uuid) {
    return new Promise((resolve, reject) => {
        const token = getRandomString(20);

        const db = new Database();

        const sql = "INSERT INTO Tokens (token, uuid, user, timestamp) VALUES (?, ?, ?, ?)";
        const value = [token, uuid, userid, +new Date()];

        db.writeQuery(sql, value)
            .then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            }).finally(() => {
                db.close();
            });
    });
}
async function isTokenValid(token, uuid) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT timestamp FROM Tokens WHERE token = ? AND uuid = ?";
        const value = [token, uuid];

        db.readQuery(sql, value)
            .then((result) => {
                if (result.length === 1 && (+new Date() - result[0].timestamp) <= 600000) {
                    refreshToken(token, uuid); //async call
                    resolve();
                } else if (result.length === 1){
                    reject('this token is expired');
                } else if (result.length !== 1){
                    reject('this token is not linked to your device');
                } else {
                    reject('too many token, login again');
                }
            }).catch((err) => {
                reject(err);
            }).finally(() => {
                db.close();
            });
    });
}

async function refreshToken(token, uuid)  {
    return new Promise( (resolve, reject) => {
        const db = new Database();

        const sql = "UPDATE Tokens SET timestamp=? WHERE token = ? AND uuid = ?";
        const value = [+new Date(), token, uuid];

        db.writeQuery(sql, value)
            .then((numUpdates) => {
                if(numUpdates === 1) {
                    resolve();
                }
                reject('cannot refresh');
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

module.exports = {
    generateToken,
    isTokenValid,
    refreshToken
};
