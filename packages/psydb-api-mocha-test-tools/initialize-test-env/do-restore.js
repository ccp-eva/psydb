'use strict';
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');

var doRestore = async function (fixtureName) {
    var out = await restore.database({
        // NOTE: never restore to local connection
        con: this.context.mongo.client,
        database: this.context.mongo.dbName,
        clean: true,
        from: fixtures.get(fixtureName, { db: true })
    })
    this.context.bsonIds = fixtures.bsonIds;

    return out;
};

module.exports = doRestore;
