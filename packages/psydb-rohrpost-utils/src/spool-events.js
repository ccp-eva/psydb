'use strict';
require('mingo/init/system');

var { createUpdater } = require('mingo/updater');
var { unescape } = require('@cdxoo/mongodb-escape-keys');

// FIXME: mingo bug when pulling ObjectId from array
var { ObjectId } = require('mongodb');
var ejson = require('@cdxoo/tiny-ejson');

var spoolEvents = (bag) => {
    var { onto = {}, events } = bag;

    //var updateObject = createUpdater({ cloneMode: "deep" });
    var updateObject = createUpdater();
    for (var it of events) {
        var { message } = it;
        //NOTE arrayFilters dont exist yet
        var { payload, arrayFilters } = message;
        // FIXME: mingo bug when pulling ObjectId from array
        var ops = ejson(unescape(payload), { prefix: '/' });

        updateObject(onto, ops, arrayFilters);
    }

    onto = ejson.parse(JSON.stringify(onto), {
        prefix: '/',
        createDate: (x) => new Date(x),
        createObjectId: (x) => new ObjectId(x),
    });
    return onto;
}

module.exports = spoolEvents;
