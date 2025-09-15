'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['externalOrganization']['catShelterOrg'];

    var orgs = []
    for (var ix of range(5)) {
        var faked = FakeRecords['externalOrganization']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        var org = await driver.externalOrganization.create({
            type: 'catShelterOrg', data: faked
        });
        orgs.push(org);
    }

    await ids.addByDriverResponse('externalOrganization', orgs);
    forcePush({
        into: refcache.data(),
        pointer: '/externalOrganization/catShelterOrg',
        values: orgs.map(it => new ObjectId(it.meta._id))
    });
}
