'use strict';
var createKoaContext = function (extraContext) {
    var { client, dbName, dbHandle } = this.getMongoContext();

    var koaContext = {
        mongoClient: client,
        mongoDbName: dbName,
        db: dbHandle,

        session: { personnelId: 1234 },
        self: { personnelId: 1234 },
        permissions: { isRoot: true },
        request: {},
        response: {},
        ip: '127.0.0.1'
    }
    return { ...koaContext, ...extraContext };
}
module.exports = createKoaContext;
