'use strict';
var ExperimentId = require('../collection-ids/experiment-id.schema.js').ref,
    LocationId = require('../collection-ids/location-id.schema.js').ref,
    Dynamic = require('../dynamic-refs.js');

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
                    items: ExperimentId,
                },
                location: LocationId,
            },
        }
    ]
}

module.exports = {
    id,
    ref,
    schema,
}
