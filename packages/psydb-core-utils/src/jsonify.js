'use strict';
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

module.exports = jsonify;
