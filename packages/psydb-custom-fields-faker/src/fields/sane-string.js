'use strict';
var { faker } = require('@faker-js/faker');
var { ucfirst } = require('@mpieva/psydb-core-utils');
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var { definition } = bag;
    var { props: { minLength = 0 }} = definition;

    var makeEmpty = pick({ from: [ true, false ], weights: [ 40, 60 ] });
    var out = makeEmpty ? '' : ucfirst(faker.word.noun());

    return out;
}

module.exports = {
    getRandomValue
}
