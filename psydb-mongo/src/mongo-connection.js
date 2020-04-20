'use strict';
var MongoClient = require('mongodb').MongoClient;

var globalConnector = undefined;
module.exports = (config) => {
    if (connection) {
        globalConnector = MongoConnector(config);
    }
    return globalConnector;
}

var MongoConnector = ({
    url,
    db,
    ...otherOptions
}) => {
    var connector = {},
        dbName = db,
        connection = undefined;
        selectedDB = undefined;

    connector.getSelectedDB = () => {
        if (!connection) {
            throw new Error('mongo client is not connected yet');
        }
        if (!selectedDB) {
            throw new Error('no database has been selected');
        }

        return selectedDB;
    };

    connector.connect = async () => {
        connection = await MongoClient.connect(
            url,
            otherOptions,
        );
        if (dbName) {
            selectedDB = connection.db(dbName);
        }
        else {
            throw new Error('no db name provided; specify "db" property');
        }
    }

    return connector;
}
