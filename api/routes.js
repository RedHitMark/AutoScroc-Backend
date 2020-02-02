module.exports = (app) => {
    const BASE_API_URL = "/api";
    const API_VERSION_1_0 = '/v1.0';

    const bodyBind = require('./v1.0/bodyBind');
    const userManagement = require('./v1.0/userManagement');
    const rentManagement = require('./v1.0/rentManagement');

    /** USER LOGIN API END-POINT**/
    app.post(BASE_API_URL + API_VERSION_1_0 + '/login/', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const uuid = req.body.uuid;

        userManagement.login(username, password, uuid)
            .then((token) => {
                res.json({token: token});
            })
            .catch((error) => {
                res.status(error.status).json({error: error.message});
            });
    });

    /** USER REGISTER API END-POINT**/
    app.post(BASE_API_URL + API_VERSION_1_0 + '/register_user/', (req, res) => {
        const user = bodyBind.bindUser(req.body);

        userManagement.register(user, 'user')
            .then((jsonSuccess) => {
                res.json(jsonSuccess);
            })
            .catch((error) => {
                res.status(error.status).json({error: error.message});
            });
    });

    /** ADMIN REGISTER API END-POINT**/
    app.post(BASE_API_URL + API_VERSION_1_0 + '/register_admin/', (req, res) => {
        const user = bodyBind.bindUser(req.body);
        console.log(user);

        userManagement.register(user, 'admin')
            .then((jsonSuccess) => {
                res.json(jsonSuccess);
            })
            .catch((error) => {
                res.status(error.status).json({error: error.message});
            });
    });

    /** GET PROFILE API END-POINT**/
    app.post(BASE_API_URL + API_VERSION_1_0 + '/get_profile/', (req, res) => {
        const token = req.body.token;
        const uuid = req.body.uuid;

        userManagement.getUserProfile(token, uuid)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                res.status(error.status).json({error: error.message});
            });
    });

    /** REVALIDATE USER TOKEN API END-POINT**/
    app.post(BASE_API_URL + API_VERSION_1_0 + '/revalidate_user/', (req, res) => {
        const token = req.body.token;
        const uuid = req.body.uuid;
        const secret = req.body.secret;

        userManagement.revalidateUser(token, uuid, secret)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                res.status(error.status).json({error: error.message});
            });
    });


    app.get(BASE_API_URL + API_VERSION_1_0 + '/rent', (req, res) => {
        const idPage = req.query.idPage || 1;
        rentManagement.getRents(idPage)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {

            });
    });


    /**
     * NOT FOUND FALL-BACK
     */
    app.get('*', (req, res) => {
        res.status(404).json({message : "not found on this server"});
    });
    app.post('*', (req, res) => {
        res.status(404).json({message : "not found on this server"});
    });
    app.delete('*', (req, res) => {
        res.status(404).json({message : "not found on this server"});
    });
    app.put('*', (req, res) => {
        res.status(404).json({message : "not found on this server"});
    })
};
