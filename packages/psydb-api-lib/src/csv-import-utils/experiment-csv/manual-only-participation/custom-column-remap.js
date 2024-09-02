'use strict';
var { CSVColumnRemappers } = require('@mpieva/psydb-common-lib');

var customColumnRemap = (col) => {
    return (
        CSVColumnRemappers.Experiment.ManualOnlyParticipation()
        .csv2obj({ colkey: col })
    );
}

module.exports = customColumnRemap;
