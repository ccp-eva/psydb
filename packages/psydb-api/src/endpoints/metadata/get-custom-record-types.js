'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    ExactObject,
    DefaultArray,
    IdentifierString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        only: DefaultArray({
            items: ExactObject({
                properties: {
                    collection: IdentifierString(),
                    types: { type: 'array', items: IdentifierString() }
                },
                required: [ 'collection' ]
            })
        }),
        ignoreResearchGroups: DefaultBool(),
    },
    required: []
});

var getCustomRecordTypes = async (context, next) => {
    var { 
        db,
        request,
        permissions,
    } = context;

    var {
        availableSubjectTypes,
        availableLocationTypes,
        availableStudyTypes,
    } = permissions;

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidRequestSchema',
            data: { ajvErrors: ajv.errors }
        });
    };

    var {
        only,
        ignoreResearchGroups
    } = request.body;

    var filters = [];
    if (only) {
        for (var outer of only) {
            var { collection, types } = outer;
            if (types) {
                for (var type of types) {
                    filters.push({ collection, type })
                }
            }
            else {
                filters.push({ collection })
            }
        }
    }

    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            ...(!permissions.isRoot() && !ignoreResearchGroups ? [
                { $match: {
                    $or: [
                        { collection: 'subject', type: {
                            $in: availableSubjectTypes.map(it => it.key)
                        }},
                        { collection: 'location', type: {
                            $in: availableLocationTypes.map(it => it.key)
                        }},
                        { collection: 'study', type: {
                            $in: availableStudyTypes.map(it => it.key)
                        }},

                        { collection: { $nin: [
                            'subject', 'location', 'study'
                        ]}}
                    ]
                }},
            ] : []),

            { $match: {
                'state.isNew': false,
                'state.internals.isRemoved': { $ne: true },
                ...(only && { $or: filters })
            }},
        ]).toArray()
    );

    context.body = ResponseBody({
        data: {
            customRecordTypes
        }
    });

    await next();
}

module.exports = getCustomRecordTypes;
