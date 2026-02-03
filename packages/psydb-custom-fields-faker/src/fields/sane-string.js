'use strict';
var { faker } = require('@faker-js/faker');
var { ucfirst } = require('@mpieva/psydb-core-utils');
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var { definition } = bag;
    var { props: { minLength = 0 }} = definition;

    var makeEmpty = (
        minLength === 0
        ? pick({ from: [ true, false ], weights: [ 40, 60 ] })
        : false
    );

    var out = makeEmpty ? '' : ucfirst(faker.word.noun({ min: minLength }));
    return out;
}

module.exports = {
    getRandomValue
}
