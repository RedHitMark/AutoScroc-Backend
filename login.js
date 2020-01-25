const DatabaseConnection = require('./DatabaseConnection');
const Token = require('./token');

module.exports = function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const db = DatabaseConnection.getConnection();

        const sql = "SELECT id FROM Users WHERE username=? AND password = ?";
        const value = [username, password];

        db.query(sql, value, (err, users) => {
            if(err) {
                res.json({message : 'cannot login'});
            }

            if(users.length === 1) {
                //Generating a token
                const token = Token.generateToken(users[0].id);

                res.json({token : token});
                db.end();
            } else {
                res.status(401).json({message : 'wrong username or password'});
            }
        });


    } else {
        const message = 'you should provide all params';
        res.status(400).json({message});
    }
};



