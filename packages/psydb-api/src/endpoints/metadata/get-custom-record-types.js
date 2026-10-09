'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var Ajv = require('@mpieva/psydb-api-lib/src/ajv');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    MaxObject,
    ExactObject,
    DefaultArray,
    IdentifierString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => MaxObject({
    'only': DefaultArray({
        items: ExactObject({
            properties: {
                'collection': IdentifierString(),
                'types': { type: 'array', items: IdentifierString() }
            },
            required: [ 'collection' ]
        })
    }),
    'ignoreResearchGroups': DefaultBool(),
});

var getCustomRecordTypes = async (context, next) => {
    var { db, request, permissions } = context;

    var {
        availableSubjectTypes,
        availableLocationTypes,
        availableStudyTypes,
        availableExternalOrganizationTypes,
        availableExternalPersonTypes,
    } = permissions;

    var ajv = Ajv();
    var isValid = false;

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

    var stages = [
        { $match: {
            'state.isNew': false,
            'state.internals.isRemoved': { $ne: true },
        }}
    ];

    if (!permissions.isRoot() && !ignoreResearchGroups) {
        stages.push({ $match: {
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
                { collection: 'externalOrganization', type: {
                    $in: availableExternalOrganizationTypes.map(it => it.key)
                }},
                { collection: 'externalPerson', type: {
                    $in: availableExternalPersonTypes.map(it => it.key)
                }},

                { collection: { $nin: [
                    'subject', 'location', 'study',
                    'externalOrganization', 'externalPerson'
                ]}}
            ]
        }})
    }

    if (only) {
        stages.push({ $match: {
            $or: filters
        }})
    }

    var customRecordTypes = await aggregateToArray({
        db, customRecordType: stages
    });

    context.body = ResponseBody({
        data: { customRecordTypes }
    });

    await next();
}

module.exports = getCustomRecordTypes;
