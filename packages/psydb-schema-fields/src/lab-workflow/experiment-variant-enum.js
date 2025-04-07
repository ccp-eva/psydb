'use strict';
var { experimentVariants } = require('@mpieva/psydb-schema-enums');
var { StringEnum } = require('../system');

var ExperimentVariantEnum = (additionalKeywords) => {
    return StringEnum(experimentVariants.keys, {
        title: 'Ablauf-Typ',
        enumNames: experimentVariants.names,
        ...additionalKeywords
    })
}

module.exports = ExperimentVariantEnum;
