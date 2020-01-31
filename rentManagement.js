const Database = require("./Database");

module.exports = {
    getAll: function (req, res, idPage) {
        query(idPage)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                res.status(400).json({error: "error"});
            });
    },
    get: function (req, res, id) {

    }
};

async function query(idPage) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Cars.name, Cars.engineType FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id LIMIT 2 OFFSET ?;";
        const value = [(idPage - 1) * 2];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });

        db.readQuery()
    });
}
