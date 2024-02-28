'use strict';
var {
    twoFactorAuth,
} = require('@mpieva/psydb-api-lib');

var signOut = async (context, next) => {
    var { db, session } = context;
    if (session) {
        var { personnelId } = session;
        await twoFactorAuth.removeCode({ db, personnelId });
    }
    
    context.session = null;
    context.body = { data: {}};

    await next();
}

module.exports = signOut;
