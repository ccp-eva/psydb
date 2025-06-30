'use strict';
var { MongoClient } = require('mongodb');

var useMysql = require('./use-mysql');
var markNonDuplicates = require('./mark-non-duplicates');

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;

    var { mongodb: mongodbConnectString } = extraOptions;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );
    
    var db = mongo.db();
    
    var [ query, mysqlConnection ] = useMysql();

    var rows = await query(`
        select
            group_concat(du_dublett_id) as seq,
            count(*) as c
        from mpi_cl_dublette
        group by du_createddate
        having c >= 2
    `);

    console.log({ rows });

    //for (var it of rows) {
    //    var sequenceNumbers = it.seq.split(',');
    //    await markNonDuplicates({ db, driver, sequenceNumbers });
    //}
    
    mongo.close();
    mysqlConnection.end();
}
