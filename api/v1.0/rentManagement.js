const Database = require("../config/Database");
const Token = require("../config/Token");

async function getRents(idPage) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const PAGE_LENGHT = 20;

        const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Rent.km, Cars.id, Cars.idModel, Cars.idBrand, Cars.name, Cars.carType, Cars.engineType, Cars.doors, Cars.trasmission, Cars.hp, Cars.kw, Cars.torque, Cars.cc, Cars.numCylinders, Cars.cylindersType, Cars.topSpeed, Cars.acc, Cars.weight, Cars.img  FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id WHERE Rent.type=0 AND Rent.idPurchaseUser IS NULL LIMIT ? OFFSET ?;";
        const value = [PAGE_LENGHT, (idPage - 1) * PAGE_LENGHT];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        }).finally(()=> {
            db.close();
        });
    });
}
async function createRent(licensePlate, idCar, matriculationYear, km, price) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "INSERT INTO Rent (licensePlate, idCar, matriculationYear, km, price, type) VALUES (?, ?, ?, ?, ?, 0)";
        const value = [licensePlate, idCar, matriculationYear, price, km];

        db.writeQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject({status: 404, message: error});
        }).finally(()=> {
            db.close();
        });
    });
}

async function getRentsOfUser(token, uuid) {
    return new Promise((resolve, reject) => {
        Token.isTokenValid(token, uuid)
            .then(() => {
                const db = new Database();

                const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Rent.km, Cars.id, Cars.idModel, Cars.idBrand, Cars.name, Cars.carType, Cars.engineType, Cars.doors, Cars.trasmission, Cars.hp, Cars.kw, Cars.torque, Cars.cc, Cars.numCylinders, Cars.cylindersType, Cars.topSpeed, Cars.acc, Cars.weight, Cars.img FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id LEFT JOIN Tokens ON Tokens.user=Rent.idPurchaseUser WHERE Tokens.token=? AND Tokens.uuid=? AND Rent.type=0;";
                const value = [token, uuid];

                db.readQuery(sql, value).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject({status: 404, message: error});
                }).finally(()=> {
                    db.close();
                });
            }).catch((invalidTokenMessage) => {
                //401: Unauthorized
                reject({status: 401, message: invalidTokenMessage});
            });
    });
}

async function buyRent(token, uuid, licensePlate) {
    return new Promise((resolve, reject) => {
        Token.isTokenValid(token, uuid)
            .then(() => {
                const db = new Database();

                const sql = "UPDATE Rent SET Rent.idPurchaseUser=(SELECT user FROM Tokens WHERE Tokens.token=? AND Tokens.uuid=?) WHERE Rent.licensePlate=?";
                const value = [token, uuid, licensePlate];

                db.readQuery(sql, value).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject({status: 404, message: error});
                }).finally(()=> {
                    db.close();
                });
            }).catch((invalidTokenMessage) => {
            //401: Unauthorized
            reject({status: 401, message: invalidTokenMessage});
        });
    });
}

module.exports = {
    getRents,
    createRent,
    getRentsOfUser,
    buyRent
};
