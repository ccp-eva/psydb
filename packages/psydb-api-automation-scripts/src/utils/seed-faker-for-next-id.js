'use strict';
var faker = require('@mpieva/psydb-faker');
var getSeedForDocId = require('./get-seed-for-doc-id');

// NOTE: the id is not sent to the api (yet); it only makes the faked
// values of each record independent of what was faked before it
var seedFakerForNextId = (bag) => {
    var { idgen, collection } = bag;

    var _id = idgen.next(collection);
    faker.seed(getSeedForDocId({ _id }));

    return _id;
}

module.exports = seedFakerForNextId;
