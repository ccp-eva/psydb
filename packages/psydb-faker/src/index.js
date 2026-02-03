'use strict';
var { faker } = require('@faker-js/faker');

module.exports = {
    FakeRecords: require('./records'),
    Fields: require('./utils').Fields,
    seed: (n) => faker.seed(n),
}
