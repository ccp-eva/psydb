'use strict';
var ExperimentId = require('../experiment/').id,
    LocationId = require('../location/').id,
    Dynamic = require('../../dynamic-refs.js');

var id = 'psy-db/subject-scientific-state.schema.js',
    ref = { $ref: `${id}#` };

var schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    allOf: [
        Dynamic.SubjectScientific,
        {
            type: 'object',
            properties: {
                experiments: {
                    type: 'array',
                    items: ExperimentId.ref,
                },
                location: LocationId.ref,
            },
        }
    ]
}

module.exports = {
    id,
    ref,
    schema,
}
