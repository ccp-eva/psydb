'use strict';

var CSV = (options = {}) => {
    var {
        delimiter = ',',
        eol = "\n"
    } = options;

    var csv = {};
    var lines = [];

    csv.addLine = (that) => lines.push(that);
    csv.toString = () => {
        return lines.map(line => {
            var sanitized = line.map(value => {
                var escaped = JSON.stringify(value);
                return `${escaped}`;
            });
            return sanitized.join(delimiter)
        }).join(eol);
    }

    return csv;
}

module.exports = CSV;
