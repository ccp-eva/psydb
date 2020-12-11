'use strict';
var rootAccountId = '5fcf4481feb7ca0683978b80',
    rootRoleId = '57c9b1db938b154f8170d837';

var messages = [
    {
        type: 'records/create/systemRole',
        payload: {
            id: rootRoleId,
            props: {
                hasRootAccess: true,
            }
        }
    },
    {
        type: 'records/create/personnel',
        payload: {
            id: rootAccountId,
            props: {
                gdpr: {
                    name: { firstname: 'ROOT', lastname: 'ADMIN' },
                    shorthand: 'ROOT',
                    emails: [
                        // TODO: possbily need to be set in config
                        { email: 'root@example.com', isPrimary: true }
                    ]
                },
            }
        }
    },
    /*{
        type: 'set-personnel-password',
        payload: {
            id: rootAccountId,
            password: 'test1234',
        },
    },*/
];

module.exports = {
    messages,
    rootAccountId,
}
