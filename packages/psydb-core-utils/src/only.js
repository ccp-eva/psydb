'usr strict';
var jsonpointer = require('jsonpointer');
var convertPathToPointer = require('./convert-path-to-pointer');

var only = ({ from, paths, pointers }) => {
    var out = {};
    if (!pointers) {
        pointers = paths.map(convertPathToPointer);
    }
    for (var pointer of pointers) {
        var value = jsonpointer.get(from, pointer);
        jsonpointer.set(out, pointer, value);
    }
    return out;
}

module.exports = only;
