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

    connector.close = () => {
        // removing global connector on close is requred when
        // using in conjucntion with beforeEach topology creation
        // via mongodb memory server in unit tests
        // else it will try to use the existing connector to the
        // destroyd topology
        globalConnector = undefined;
        return connection.close();
    }

    return connector;
}
