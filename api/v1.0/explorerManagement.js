const Database = require("../config/Database");

async function getBrands(idPage) {
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

module.exports = {
    getBrands,
};
