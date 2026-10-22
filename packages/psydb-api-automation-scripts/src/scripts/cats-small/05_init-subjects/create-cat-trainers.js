'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['subject']['catTrainer'];

    var trainers = [];
    for (var ix of range(5)) {
        var faked = FakeRecords['subject']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        var trainer = await driver.subject.create({
            type: 'catTrainer', data: faked
        });
        trainers.push(trainer);
    }

    await ids.addByDriverResponse('subject', trainers);
    forcePush({
        into: refcache.data(),
        pointer: '/subject/catTrainer',
        values: trainers.map(it => new ObjectId(it.meta._id))
    });
}
