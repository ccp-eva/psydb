'use strict';
var brypt = require('bcrypt');

var handleMessage = async ({
    db,
    rohrpost,
    message
}) => {
    var { type: messageType, personnelId, payload } = message;
    var { id: targetRecordId, password } = payload;

    var channel = (
        rohrpost
        .openCollection('personnel')
        .openChannel({ id: targetRecordId })
    );

    var passwordHash = brypt.hashSync(password, 10);

    await channel.dispatch({ subChannelKey: 'gdpr', message: {
        type: 'put',
        personnelId,
        payload: {
            prop: '/internals/passwordHash',
            value: passwordHash
        }
    }})
}

module.exports = handleMessage;
