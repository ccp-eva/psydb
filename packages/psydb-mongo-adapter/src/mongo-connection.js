'use strict';
var debug = require('debug')('psydb:mongo-adapter:mongo-connection');
var { MongoClient } = require('mongodb');

var globalConnector = undefined;
module.exports = (config) => {
    if (config && !globalConnector) {
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
        conpromise = undefined,
        connection = undefined,
        selectedDbName = undefined,
        selectedDb = undefined;

    connector.getConnection = () => {
        return connection;
    };
    connector.getSelectedDbName = () => {
        return selectedDbName;
    };

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
        debug('connect()');
        if (!conpromise) {
            debug('creating conpromise');
            conpromise = MongoClient.connect(
                url,
                otherOptions,
            );
        }

        if (!connection) {
            debug('awaiting connection');
            connection = await conpromise;
            
            if (dbName) {
                selectedDbName = dbName;
                selectedDb = connection.db(dbName);
            }
            else {
                throw new Error('property "dbName" missing');
            }
        }
        else {
            debug('already connected');
        }
        
    }

    connector.close = () => {
        debug('close()');
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
