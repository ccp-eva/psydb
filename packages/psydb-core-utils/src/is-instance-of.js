'use strict';
var arrify = require('./arrify');

var isInstanceOf = (obj, instances) => {
    var instances = arrify(instances);
    var is = false;
    for (var it of instances) {
        if (obj instanceof it) {
            is = true;
            break;
        }
    }
    return is;
}

module.exports = isInstanceOf;
