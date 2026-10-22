'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, refcache, ids, crts, idgen } = context;
    var crtSettings = crts['location']['catLabRoom'];

    for (var ix of range(5)) {
        seedFakerForNextId({ idgen, collection: 'location' });
        var faked = FakeRecords['location']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        await driver.location.create({
            type: 'catLabRoom', data: faked
        });
    }
}
