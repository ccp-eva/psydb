'use strict';
var { entries } = Object;
var PsyDBSchema = require('./psydb-schema');

var verifyPsyDBSchemaDeep = (bag) => {
    var { keywords } = bag;
    var {
        properties, patternProperties,
        items, prefixItems,
        oneOf,
        
        //if: jssIF, then: jssTHEN, else: jssELSE,
        //not: jssNOT
    } = keywords;
    
    if (properties) {
        for (var [ key, value ] of entries(properties)) {
            verifyIsPsyDBSchema(value, `property "${key}"`);
        }
    }
    if (patternProperties) {
        for (var [ key, value ] of entries(patternProperties)) {
            verifyIsPsyDBSchema(value, `patternProperty "${key}"`);
        }
    }

    verifyIsPsyDBSchema(items, 'keyword "items"');
    verifyIsPsyDBSchema(prefixItems, 'keyword "prefixItems"');

    if (oneOf) {
        for (var it of oneOf) {
            verifyIsPsyDBSchema(it, `keyword "oneOf[${it}]"`);
        }
    }
}

var verifyIsPsyDBSchema = (value, label) => {
    if (value === undefined) {
        return;
    }
    if (!(value instanceof PsyDBSchema)) {
        throw new Error(`${label} not instance of PsyDBSchema`);
    }
}

module.exports = verifyPsyDBSchemaDeep;
