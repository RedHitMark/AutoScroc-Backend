const Database = require('./Database');
const Token = require('./token');

module.exports = function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const db = new Database();


        const sql = "SELECT id FROM Users WHERE username=? AND password = ?";
        const value = [username, password];

        db.readQuery(sql, value).then((users) => {
            if(users.length === 1) {
                Token.generateToken(users[0].id).then((token) => {
                    res.json({token : token});
                }).catch( () => {
                    res.status(300).json({message : 'cannot generate token'})
                });
            } else {
                res.status(401).json({message : 'wrong username or password'});
            }
        }).catch((sqlError) => {
            res.status(501).json({error : 'sql error'});
        }).finally(() => {
            db.close();
        });
    } else {
        const message = 'you should provide all params';
        res.status(400).json({message});
    }
};



