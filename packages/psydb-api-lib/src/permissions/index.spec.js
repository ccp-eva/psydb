'use strict';
var expect = require('chai').expect,
    Permissions = require('./index');

var validRootMessageTypes = [
    'records/create/foo',
    'records/create/foo/bar',
    'records/create/foo/bar/baz'
];

var validRootEndpoints = [
    '/events',
    '/search',
    '/search-for-testing/123456'
];

var systemRoles = {
    'root': { state: {
        hasRootAccess: true
    }}
}

describe('permissions', () => {

    it('root message types', () => {
        var permissions = Permissions({
            systemRole: systemRoles.root,
            researchGroupIds: [],
        });
        validRootMessageTypes.forEach((type) => {
            console.log(type);
            expect(permissions.canUseMessageType(type)).to.eql(true);
        })
    });

    it('root endpoints', () => {
        var permissions = Permissions({
            systemRole: systemRoles.root,
            researchGroupIds: [],
        });
        validRootEndpoints.forEach((endpoint) => {
            console.log(endpoint);
            expect(permissions.canAccessEndpoint(endpoint)).to.eql(true);
        })
    });

});
