'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['externalPerson']['catShelterPerson'];

    var persons = []
    for (var ix of range(60)) {
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
