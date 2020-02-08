const Database = require("../config/Database");

async function getBrands() {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT * FROM Brands";
        const value = [];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        }).finally(()=> {
            db.close();
        });
    });
}

async function getModelsByBrandID(idBrand) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT * FROM Models WHERE idBrand=?";
        const value = [idBrand];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        }).finally(()=> {
            db.close();
        });
    });
}

async function getCarsByModelID(idModel) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT * FROM Cars WHERE idModel=?";
        const value = [idModel];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        }).finally(()=> {
            db.close();
        });
    });
}

async function getCar(id) {
    return new Promise((resolve, reject) => {
        const db = new Database();

        const sql = "SELECT * FROM Cars WHERE id=?";
        const value = [id];

        db.readQuery(sql, value).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        }).finally(()=> {
            db.close();
        });
    });
}

module.exports = {
    getBrands,
    getModelsByBrandID,
    getCarsByModelID,
    getCar
};
