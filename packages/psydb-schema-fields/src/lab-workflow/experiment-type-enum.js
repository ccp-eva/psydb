'use strict';
var { experimentTypes } = require('@mpieva/psydb-schema-enums');
var { StringEnum } = require('../system');

var ExperimentTypeEnum = (additionalKeywords) => {
    return StringEnum(experimentTypes.keys, {
        title: 'Experiment-Typ',
        enumNames: experimentTypes.names,
        ...additionalKeywords
    })
}

module.exports = ExperimentTypeEnum;
