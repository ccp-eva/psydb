'use strict';
var {
    twoFactorAuthentication,
} = require('@mpieva/psydb-api-lib');

var signOut = async (context, next) => {
    var { db, session } = context;
    if (session) {
        var { personnelId } = session;
        await twoFactorAuthentication.removeCode({ db, personnelId });
    }
    
    context.session = null;
    context.body = { data: {}};

    await next();
}

module.exports = signOut;
