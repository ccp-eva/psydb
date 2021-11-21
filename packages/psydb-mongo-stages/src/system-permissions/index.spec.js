'use strict';
var { SystemPermissionStages } = require('./');

describe('system-permission-stages', () => {
    
    test('root access has no additional stages', () => {
        var stages = SystemPermissionStages({
            collection: 'subject',
            permissions: { hasRootAccess: true }
        })
        expect(stages).toEqual([]);
    });

    test('non-root with one research group has proper stages', () => {
        var stages = SystemPermissionStages({
            collection: 'subject',
            permissions: {
                hasRootAccess: false,
                //projectedResearchGroupIds: [ 'gid_1' ],
                //byResearchGroupId: {
                //    'gid_1': { canReadSubjects: true }
                //},
                researchGroupIdsByCollection: {
                    'subject': { read: [ 'gid_1' ], write: [] }
                }
            }
        });

        //console.dir(stages, { depth: null });
        expect(stages).toMatchSnapshot()
    })

    test('root access with forced group has proper stages', () => {

    })

})
