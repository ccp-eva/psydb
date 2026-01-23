'use strict';
var { faker } = require('@faker-js/faker');
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var { definition } = bag;
    var { props: { minLength = 0 }} = definition;

    var makeEmpty = (
        minLength === 0
        ? pick({ from: [ true, false ], weights: [ 40, 60 ] })
        : false
    );

    var out = makeEmpty ? '' : faker.lorem.paragraphs(2);
    return out;
}

module.exports = {
    getRandomValue
}
