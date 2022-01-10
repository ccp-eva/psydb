'usr strict';
var jsonpointer = require('jsonpointer');
var convertPathToPointer = require('./convert-path-to-pointer');

var only = ({ from, paths }) => {
    var out = {};
    for (var path of paths) {
        var pointer = convertPathToPointer(path);
        var value = jsonpointer.get(from, pointer);
        jsonpointer.set(out, pointer, value);
    }
    return out;
}

module.exports = only;
