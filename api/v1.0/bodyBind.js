
function bindUser(obj) {
    return {
        name: obj.name,
        surname: obj.surname,
        email: obj.email,
        username: obj.username,
        password: obj.password,
        address: obj.address,
        city: obj.city,
        region: obj.region,
        country: obj.country,
        tel: obj.tel,
        img: obj.img
    };
}
function bindRent(obj) {
    return {
        car: obj.car,
        price: obj.price,
        km: objkm
    };
}

module.exports = {
    bindUser
};
