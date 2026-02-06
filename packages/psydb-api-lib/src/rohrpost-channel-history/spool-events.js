'use strict';
require('mingo/init/system');
var { copy } = require('copy-anything');
var { createUpdater } = require('mingo/updater');
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { only, flatten } = require('@mpieva/psydb-core-utils');

var spoolEvents = (bag) => {
    var { onto = {}, events } = bag;
    
    var performUpdate = createUpdater({ cloneMode: "deep" });
    var updates = [];
    for (var it of events) {
        var { message } = it;
        //NOTE arrayFilters dont exist yet
        var { payload, arrayFilters } = message;
        var ops = unescape(payload);

        var prev = copy(onto);
        var u = performUpdate(onto, ops, arrayFilters);
        console.log({ it });
        console.log({ u });
        console.log(flatten(only({ from: prev, paths: u })));
        console.log(flatten(only({ from: onto, paths: u })));
    }

    return [ onto, updates ];
}

module.exports = spoolEvents;
