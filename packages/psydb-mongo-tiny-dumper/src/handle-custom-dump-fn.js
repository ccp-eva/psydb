'use strict';
var mongoutils = require('@cdxoo/mongodb-utils');
var dumpstream = require('@cdxoo/mongodb-dump-stream');
var { FSDirProcessor } = require('@cdxoo/mongodb-dump-stream-processors');
var withRetracedErrors = require('./with-retraced-errors');
var connectClient = require('./connect-client');

var handleCustomDumpFN = async (bag) => {
    var { url, fullOutPath, customDumpFN } = bag;

    var client = await connectClient({ url });
    try {
        var tracking = [];
        var db = client.db();
        var helpers = createHelpers({ db, tracking, fullOutPath });

        console.log(`Connected to "${url}"`);
        console.log(`Database is "${db.databaseName}"`);

        await customDumpFN({ db, ...helpers });
    }
    finally {
        client.close();
    }

}

var createHelpers = (bag) => {
    var { db, tracking, fullOutPath } = bag;

    var maybeCreateStreamId = (bag) => {
        var { track: booleanOrStreamId, ...downstream } = bag;

        if (booleanOrStreamId) {
            var { mongoSettings, ...rest } = downstream;

            var dbName = db.databaseName;
            var [ collection, query ] = Object.entries(rest)[0];

            var streamId = (
                booleanOrStreamId === true
                ? { database: db.databaseName, collection }
                : booleanOrStreamId
            );

            return streamId
        }
    }

    var helpers = {};
    helpers.aggregateToArray = async (bag) => {
        var { track: booleanOrStreamId, ...downstream } = bag;
        
        var streamId = maybeCreateStreamId(bag);
        if (streamId) {
            var cursor = mongoutils.aggregateToCursor({ db, ...downstream });
            tracking.push({ streamId, cursor });
        }
        
        return await withRetracedErrors(
            mongoutils.aggregateToArray({ db, ...downstream })
        );
    }
    helpers.aggregateToCursor = (bag) => {
        var { track: booleanOrStreamId, ...downstream } = bag;

        var streamId = maybeCreateStreamId(bag);
        if (streamId) {
            var cursor = mongoutils.aggregateToCursor({ db, ...downstream });
            tracking.push({ streamId, cursor });
        }
        
        return mongoutils.aggregateToCursor({ db, ...downstream })
    }

    helpers.dump = async () => {
        console.log('Will dump to:', fullOutPath);

        for (var it of tracking) {
            var { streamId, cursor } = it;

            var stream = await dumpstream.cursor({ cursor, streamId });
            await FSDirProcessor(stream, { to: fullOutPath });
        }
        
        console.log('...done');
    }

    return helpers;
}

module.exports = handleCustomDumpFN;
