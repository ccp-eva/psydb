// OpsTeam
'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    fetchRelatedLabels,
} = require('@mpieva/psydb-api-lib');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var fetchLabProcedureSettingData = async (options) => {
    var { db, timezone, match } = options;

    var records = await (
        db.collection('experimentVariantSetting')
        .aggregate([
            { $match: match },
            StripEventsStage(),
        ])
        .toArray()
    );

    var creators = (
        allSchemaCreators
        .experimentVariantSetting.fixedTypeStateSchemaCreators
    );

    var recordSchema = { type: 'object', properties: {
        records: {
            type: 'array', items: {
                lazyResolveProp: 'type',
                oneOf: (
                    Object.keys(creators).map(key => ({
                        type: 'object',
                        properties: {
                            type: { const: key },
                            state: creators[key]()
                        }
                    }))
                )
            }
        }
    }};

    var related = await fetchRelatedLabels({
        db,
        data: { records },
        schema: recordSchema,
        timezone,
    });

    return {
        records,
        related
    }
}

module.exports = fetchLabProcedureSettingData;
