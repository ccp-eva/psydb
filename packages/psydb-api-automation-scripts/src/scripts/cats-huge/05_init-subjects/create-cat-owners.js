'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['subject']['catOwner'];

    var owners = [];
    for (var ix of range(1000)) {
        var faked = FakeRecords['subject']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        var owner = await driver.subject.create({
            type: 'catOwner', data: faked
        });
        owners.push(owner);
    }

    await ids.addByDriverResponse('subject', owners);
    forcePush({
        into: refcache.data(),
        pointer: '/subject/catOwner',
        values: owners.map(it => new ObjectId(it.meta._id))
    });
}
