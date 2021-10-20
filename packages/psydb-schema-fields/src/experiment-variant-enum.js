'use strict';
var { experimentVariants } = require('@mpieva/psydb-schema-enums');
var StringEnum = require('./string-enum');

var ExperimentVariantEnum = (additionalKeywords) => {
    return StringEnum(experimentVariants.keys, {
        title: 'Ablauf-Typ',
        enumNames: experimentVariants.names,
        ...additionalKeywords
    })
}

module.exports = ExperimentVariantEnum;
