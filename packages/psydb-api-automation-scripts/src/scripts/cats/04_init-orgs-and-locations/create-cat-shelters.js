'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['location']['catShelter'];

    for (var ix of range(10)) {
        var faked = FakeRecords['location']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        await driver.location.create({
            type: 'catShelter', data: faked
        });
    }
}
