'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['externalOrganization']['catShelterOrg'];

    for (var ix of range(2)) {
        var faked = FakeRecords['externalOrganization']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        console.ejson(faked);
        await driver.externalOrganization.create({
            type: 'catShelterOrg', data: faked
        });
    }
}
