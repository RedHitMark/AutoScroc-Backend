const DatabaseConnection = require('./DatabaseConnection');

module.exports = {
    isTokenValid: async (token) => {
        const timestamp = await retriveTokenTimestamp(token);

        return (+new Date() - timestamp) <= 600000; //10 minutes
    },
    generateToken: (userid) => {
        const token = getRandomString(20);

        insertToken(token, userid);

        return token;
    }
};


function insertToken(token, userid) {
    const db = DatabaseConnection.getConnection();

    const sql = "INSERT INTO Tokens (token, user, timestamp) VALUES (?, ?, ?)";
    const value = [token, userid, +new Date()];

    db.query(sql, value, (err, result) => {
        if(err) { throw err}
    });
}

async function retriveTokenTimestamp(token) {
    const db = DatabaseConnection.getConnection();

    const sql = "SELECT timestamp FROM Tokens WHERE token = ?";
    const value = [token];

    db.query(sql, value, (err, tokens) => {
        if(err) { throw err}

        if(tokens.length === 1) {
            return tokens[0].timestamp;
        }
    });
}

function getRandomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
