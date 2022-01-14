'use strict';
var rootAccountId = '5fcf4481feb7ca0683978b80',
    rootRoleId = '57c9b1db938b154f8170d837';

var messages = [
    /*{
        type: 'systemRole/create',
        payload: {
            id: rootRoleId,
            props: {
                name: 'ROOT-ROLE',
                hasRootAccess: true,
            }
        }
    },*/
    {
        type: 'personnel/create',
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
                scientific: {
                    canLogIn: true,
                    hasRootAccess: true,
                }
            }
        }
    },
    ({ send, knownEventIds }) => send({
        type: 'set-personnel-password',
        payload: {
            id: rootAccountId,
            lastKnownEventId: knownEventIds.personnel.gdpr[rootAccountId],
            method: 'manual',
            password: 'test1234',
            sendMail: true,
        }
    }),
];

module.exports = {
    messages,
    rootAccountId,
}
