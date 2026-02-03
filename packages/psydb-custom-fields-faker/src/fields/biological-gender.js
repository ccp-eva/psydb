'use strict';
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var { definition } = bag;
    var { props: { enableUnknownValue, enableOtherValue }} = definition;

    var options = [ 'female', 'male' ];
    var weights = [ 40, 40 ];

    if (enableUnknownValue) {
        options.push('unknown'); weights.push(10);
    }
    if (enableUnknownValue) {
        options.push('other'); weights.push(10);
    }

    var out = pick({ from: options, weights });
    return out;
}

module.exports = {
    getRandomValue
}
