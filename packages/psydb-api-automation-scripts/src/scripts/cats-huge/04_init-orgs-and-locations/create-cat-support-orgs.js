'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, refcache, ids, crts, idgen } = context;
    var crtSettings = crts['externalOrganization']['catSupportOrg'];

    var orgs = []
    for (var ix of range(15)) {
        seedFakerForNextId({ idgen, collection: 'externalOrganization' });
        var faked = FakeRecords['externalOrganization']({
            refcache: refcache.data(), crtSettings, overrides: {}
        });
        var org = await driver.externalOrganization.create({
            type: 'catSupportOrg', data: faked
        });
        orgs.push(org);
    }

    await ids.addByDriverResponse('externalOrganization', orgs);
    forcePush({
        into: refcache.data(),
        pointer: '/externalOrganization/catSupportOrg',
        values: orgs.map(it => new ObjectId(it.meta._id))
    });
}
