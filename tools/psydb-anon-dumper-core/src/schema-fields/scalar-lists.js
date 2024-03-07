'use strict';
var { DefaultArray } = require('./core-composition');
var scalar = require('./scalar');

var scalarLists = {};
// NOTE: let
for (let [ key, ScalarSchema ] of Object.entries(scalar)) {
    scalarLists[`${key}List`] = (bag = {}) => {
        var { items = {}} = bag;
        var { anonKeep, anonT } = items;

        var psyschema = DefaultArray({
            items: ScalarSchema({ anonKeep, anonT })
        });

        return psyschema;
    }
}

module.exports = scalarLists;
