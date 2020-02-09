const Database = require("../config/Database");
const Token = require("../config/Token");

async function getSales(idPage) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const PAGE_LENGHT = 20;

        const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Rent.km, Cars.id, Cars.name, Cars.carType, Cars.engineType, Cars.doors, Cars.trasmission, Cars.hp, Cars.kw, Cars.torque, Cars.cc, Cars.numCylinders, Cars.cylindersType, Cars.topSpeed, Cars.acc, Cars.weight, Cars.img  FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id WHERE Rent.type=1 LIMIT ? OFFSET ?;";
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
async function createSale(idPage) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const PAGE_LENGHT = 20;

        const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Rent.km, Cars.name, Cars.carType, Cars.engineType, Cars.doors, Cars.trasmission, Cars.hp, Cars.kw, Cars.torque, Cars.cc, Cars.numCylinders, Cars.cylindersType, Cars.topSpeed, Cars.acc, Cars.weight, Cars.img  FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id WHERE Rent.type=0 LIMIT ? OFFSET ?;";
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

async function getPurchasesOfUser(token, uuid) {
    return new Promise((resolve, reject) => {
        Token.isTokenValid(token, uuid)
            .then(() => {
                const db = new Database();

                const sql = "SELECT Rent.licensePlate, Rent.matriculationYear, Rent.price, Rent.km, Cars.id, Cars.idModel, Cars.idBrand, Cars.name, Cars.carType, Cars.engineType, Cars.doors, Cars.trasmission, Cars.hp, Cars.kw, Cars.torque, Cars.cc, Cars.numCylinders, Cars.cylindersType, Cars.topSpeed, Cars.acc, Cars.weight, Cars.img FROM Rent LEFT JOIN Cars ON Rent.idCar=Cars.id LEFT JOIN Tokens ON Tokens.user=Rent.idPurchaseUser WHERE Tokens.token=? AND Tokens.uuid=? AND Rent.type=1;";
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

module.exports = {
    getSales,
    createSale,
    getPurchasesOfUser
};
