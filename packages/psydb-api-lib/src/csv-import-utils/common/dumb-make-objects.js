'use strict';
var qs = require('qs');
// NOTE: clean-deep has 3 lodash deps
var clean = require('clean-deep');

var delimiter = ';';
var qsOptions = {
    delimiter,
    encode: true,
    allowDots: true,
    encodeValuesOnly: true, // encode values but not columns
    strictNullHandling: true, // to be able to clean empty items
    //interpretNumericEntities: true, // i.e. utf8-special chars
    plainObjects: true,
}

var dumbMakeObjects = (bag) => {
    var { csvLines, csvColumns } = bag;

    var items = [];
    for (var line of csvLines) {
        var urlified = urlify({ csvColumns, csvLine: line });
        var parsed = qs.parse(urlified, qsOptions);
        var cleaned = clean(parsed, { emptyArrays: false });
        
        items.push(cleaned);
    }

    return items;
}

var urlify = ({ csvColumns, csvLine }) => {
    var out = [];
    for (var [ix, value] of csvLine.entries()) {
        if (value === '') {
            out.push(`${csvColumns[ix]}`); // => creates null value
        }
        else {
            out.push(`${csvColumns[ix]}=${encodeURIComponent(value)}`);
        }
    }
    return out.join(delimiter);
}

module.exports = dumbMakeObjects;
