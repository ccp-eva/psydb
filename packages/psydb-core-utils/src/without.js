'use strict';

var without = (...args) => {
    var that, _without;
    if (args.length === 1 && typeof args[0] === 'object') {
        ({ that, without: _without } = args[0]);
    }
    else {
        ([ that, _without ] = args);
    }

    return that.filter(it => !_without.includes(it));
}

module.exports = without;
