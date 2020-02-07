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

async function getModelsByBrand(idBrand) {
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

module.exports = {
    getBrands,
    getModelsByBrand,
};
