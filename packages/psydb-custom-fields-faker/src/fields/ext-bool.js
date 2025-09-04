'use strict';
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = pick({ from: ['yes', 'no', 'unknown'] });
    return out;
}

module.exports = {
    getRandomValue
}
