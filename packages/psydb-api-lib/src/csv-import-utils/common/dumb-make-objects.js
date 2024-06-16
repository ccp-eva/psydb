'use strict';
var qs = require('qs');

var delimiter = ';';
var qsOptions = {
    delimiter,
    encode: true,
    allowDots: true,
    encodeValuesOnly: true,
    //interpretNumericEntities: true,
}

var dumbMakeObjects = (bag) => {
    var { csvLines, csvColumns } = bag;

    var items = [];
    for (var line of csvLines) {
        var urlified = urlify({ csvColumns, csvLine: line });
        var parsed = qs.parse(urlified, qsOptions);
        items.push(parsed);
    }

    return items;
}

var urlify = ({ csvColumns, csvLine }) => {
    var out = [];
    for (var [ix, value] of csvLine.entries()) {
        out.push(`${csvColumns[ix]}=${encodeURIComponent(value)}`);
    }
    return out.join(delimiter);
}

module.exports = dumbMakeObjects;
