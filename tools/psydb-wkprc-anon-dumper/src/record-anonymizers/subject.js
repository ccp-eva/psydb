'use strict';
var { Anonymizer } = require('@mpieva/psydb-anon-dumper-core');
var { faker } = require('@faker-js/faker');
var { noun, text } = require('../utils/fake-helpers');

var hooks = {
    'text': ({ root, value }) => text(),
    'title': ({ root, value }) => noun('Annoucement'),
    'townQuery.item': ({ root, value }) => faker.location.city()
}

module.exports = Anonymizer({ hooks })
