'use strict';
var MongoClient = require('mongodb').MongoClient;

var globalConnector = undefined;
module.exports = (config) => {
    if (config) {
        globalConnector = MongoConnector(config);
    }
    return globalConnector;
}

var MongoConnector = ({
    url,
    dbName,
    ...otherOptions
}) => {
    var connector = {},
        connection = undefined,
        selectedDb = undefined;

    connector.getSelectedDb = () => {
        if (!connection) {
            throw new Error('mongo client is not connected yet');
        }
        if (!selectedDb) {
            throw new Error('no database has been selected');
        }

        return selectedDb;
    };

    connector.connect = async () => {
        connection = await MongoClient.connect(
            url,
            otherOptions,
        );
        if (dbName) {
            selectedDb = connection.db(dbName);
        }
        else {
            throw new Error('no db name provided; specify "dbName" property');
        }
    }

    connector.close = () => (
        connection.close()
    )

    return connector;
}
