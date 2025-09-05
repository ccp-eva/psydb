'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = faker.helpers.fromRegExp('0[0-9]{3}/[0-9]{7}');
    //var out = faker.phone.number('0###/#######');
    return out;
}

module.exports = {
    getRandomValue
}
