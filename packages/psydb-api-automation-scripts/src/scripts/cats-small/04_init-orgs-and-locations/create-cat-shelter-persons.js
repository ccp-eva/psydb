'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords } = require('@mpieva/psydb-faker');
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, refcache, ids, crts, idgen } = context;
    var crtSettings = crts['externalPerson']['catShelterPerson'];

    var persons = []
    for (var ix of range(5)) {
        seedFakerForNextId({ idgen, collection: 'externalPerson' });
        var faked = FakeRecords['externalPerson']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        var person = await driver.externalPerson.create({
            type: 'catShelterPerson', data: faked
        });
        persons.push(person);
    }

    await ids.addByDriverResponse('externalPerson', persons);
    forcePush({
        into: refcache.data(),
        pointer: '/externalPerson/catShelterPerson',
        values: persons.map(it => new ObjectId(it.meta._id))
    });
}
