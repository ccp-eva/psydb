'use strict';
var Permissions = require('./');

describe('Permissions()', () => {
    test('non-root; one research group; single flag', () => {
        var permissions = Permissions({
            hasRootAccess: false,
            researchGroupIds: [ 'gid_1' ],
            forcedResearchGroupId: undefined,
            rolesByResearchGroupId: {
                'gid_1': { state: {
                    canReadSubjects: true,
                }}
            }
        });

        //console.dir({ permissions }, { depth: null })
        expect(permissions).toMatchSnapshot()
    });

    test('non-root; multiple research group; single flag', () => {
        var permissions = Permissions({
            hasRootAccess: false,
            researchGroupIds: [ 'gid_1', 'gid_2' ],
            forcedResearchGroupId: undefined,
            rolesByResearchGroupId: {
                'gid_1': { state: {
                    canReadSubjects: true,
                }},
                'gid_2': { state: {
                    canReadSubjects: true,
                }}
            }
        });

        //console.dir({ permissions }, { depth: null })
        expect(permissions).toMatchSnapshot()
    })
    
    test('non-root; multiple research group; mixed flags', () => {
        var permissions = Permissions({
            hasRootAccess: false,
            researchGroupIds: [ 'gid_1', 'gid_2' ],
            forcedResearchGroupId: undefined,
            rolesByResearchGroupId: {
                'gid_1': { state: {
                    canReadSubjects: true,
                    canWriteSubjects: true,
                }},
                'gid_2': { state: {
                    canReadSubjects: true,
                    canReadStudies: true,
                }}
            }
        });

        //console.dir({ permissions }, { depth: null })
        expect(permissions).toMatchSnapshot()
    })

    test('non-root; multiple research group + forced; mixed flags', () => {
        var permissions = Permissions({
            hasRootAccess: false,
            researchGroupIds: [ 'gid_1', 'gid_2' ],
            forcedResearchGroupId: 'gid_2',
            rolesByResearchGroupId: {
                'gid_1': { state: {
                    canReadSubjects: true,
                    canWriteSubjects: true,
                }},
                'gid_2': { state: {
                    canReadSubjects: true,
                    canReadStudies: true,
                }}
            }
        });

        //console.dir({ permissions }, { depth: null })
        expect(permissions).toMatchSnapshot()
    })

    test('root; multiple research group + forced; mixed flags', () => {
        var permissions = Permissions({
            hasRootAccess: true,
            researchGroupIds: [ 'gid_1', 'gid_2' ],
            forcedResearchGroupId: 'gid_2',
            rolesByResearchGroupId: {
                'gid_1': { state: {
                    canReadSubjects: true,
                    canWriteSubjects: true,
                }},
                'gid_2': { state: {
                    canReadSubjects: true,
                    canReadStudies: true,
                }}
            }
        });

        //console.dir({ permissions }, { depth: null })
        expect(permissions).toMatchSnapshot()
    })
})
