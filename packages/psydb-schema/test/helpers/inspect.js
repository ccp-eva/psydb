'use strict';
var nodeutil = require('util');

var inspect = (o) => {
    console.log(nodeutil.inspect(o, { 
        showHidden: false,
        depth: null
    }))
};

module.exports = inspect;
