'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');

var beforeAll = async function () {
    this.context = {
        mongo: {},
    };
    
    await mongoHelpers.startup(this.context.mongo)();
    
    this.getDbHandle = () => {
        return this.context.mongo.dbHandle;
    }

    this.restore = async (fixtureName) => {
        var out = await restore.database({
            con: this.context.mongo.client,
            database: this.context.mongo.dbName,
            clean: true,
            from: fixtures.get(fixtureName, { db: true })
        })

        return out;
    };
}

var beforeEach = async function () {}

var afterEach = async function () {
    await mongoHelpers.clean(this.context.mongo)();
}

var afterAll = async function () {
    await mongoHelpers.teardown(this.context.mongo)();
}

module.exports = {
    mochaHooks: {
        beforeAll: [ beforeAll ],
        beforeEach: [ beforeEach ],
        afterEach: [ afterEach ],
        afterAll: [ afterAll ]
    }
}
