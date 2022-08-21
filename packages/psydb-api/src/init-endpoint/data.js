'use strict';
var { ObjectId } = require('mongodb');
var rootAccountId = ObjectId('5fcf4481feb7ca0683978b80');

var messages = [
    {
        type: 'personnel/create',
        payload: {
            id: rootAccountId,
            props: {
                gdpr: {
                    firstname: 'ROOT',
                    lastname: 'ADMIN',
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
