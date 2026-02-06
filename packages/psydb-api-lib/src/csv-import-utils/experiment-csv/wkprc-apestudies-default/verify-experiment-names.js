'use strict';
var inline = require('@cdxoo/inline-text');
var { unique } = require('@mpieva/psydb-core-utils');
var { CSVImportError } = require('../../errors');

var verifyExperimentNames = async (bag) => {
    var { db, study, preparedObjects } = bag;
    var { experimentNames = [] } = study.state;

    var invalid = [];
    for (var it of preparedObjects) {
        var { experimentName } = it;
        if (!experimentNames.includes(experimentName)) {
            invalid.push(experimentName);
        }
    }
    
    if (invalid.length > 0) {
        var str_invalid = (
            unique({ from: invalid }).map(it => `"${it}"`).join(', ')
        );
        var str_available = (
            unique({ from: experimentNames }).map(it => `"${it}"`).join(', ')
        );

        throw new CSVImportError(
            inline`
                The following experiment names could not be
                found in the study: ${str_invalid}.
                ${ str_available.length > 0 ? (
                    `Available experiment names are: ${str_available}.`
                ) : (
                    'No experiment names are set in study!'
                )}
            `
        );
    }
}

module.exports = verifyExperimentNames;
