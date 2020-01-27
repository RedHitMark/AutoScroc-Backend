const Database = require('./Database');

module.exports = {
    isTokenValid: (token) => {
        return new Promise((resolve) => {
            retriveTokenTimestamp(token).then((timestamp) => {
                console.log(timestamp);
                console.log(+new Date());
                console.log(+new Date() - timestamp);

                resolve((+new Date() - timestamp) <= 600000); //10 minutes
            }).catch((err) => {
                resolve(false);
            });
        });
    },
    generateToken: (userid) => {
        return new Promise((resolve, reject) => {
            const token = getRandomString(20);

            insertToken(token, userid).then(() => {
                resolve(token);
            }).catch((err) => {
                reject()
            });
        });
    }
};


function insertToken(token, userid) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "INSERT INTO Tokens (token, user, timestamp) VALUES (?, ?, ?)";
        const value = [token, userid, +new Date()];

        db.writeQuery(sql, value).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        }).finally(() => {
            db.close();
        });
    });
}

async function retriveTokenTimestamp(token) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT timestamp FROM Tokens WHERE token = ?";
        const value = [token];

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
