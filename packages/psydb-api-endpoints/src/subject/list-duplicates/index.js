'use strict';
var debug = require('debug')('psydb:api:endpoints:subject:listDuplicates');
var {
    ejson, jsonpointer, keyBy, arrify,
    convertPointerToPath, convertPathToPointer,
} = require('@mpieva/psydb-core-utils');

var { __fixRelated } = require('@mpieva/psydb-common-compat');

var {
    aggregateToArray,
    aggregateToCursor
} = require('@mpieva/psydb-mongo-adapter');
var { match, expressions } = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
    withRetracedErrors,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var { fetchRelated } = require('@mpieva/psydb-api-endpoint-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions, apiConfig, i18n } = context;
    var {
        dev_enableSubjectDuplicatesSearch,
        dev_subjectDuplicatesSearchFields
    } = apiConfig;

    if (!dev_enableSubjectDuplicatesSearch) {
        throw new ApiError(409, 'NotConfigured');
    }
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    debug('start validating');

    validateOrThrow({
        schema: CoreBodySchema(),
        payload: request.body,
        //unmarshalClientTimezone: timezone,
    });

    var { recordType = undefined } = request.body;

    var crt = await fetchCRTSettings({
        db, collectionName: 'subject', recordType, wrap: true
    });

    var pointerConfig = (
        dev_subjectDuplicatesSearchFields?.[recordType] || []
    );
    
    var allPointers = pointerConfig.flat();
    var allPrimaryPointers = pointerConfig.map(it => arrify(it)[0]);

    var allFields = crt.findCustomFields({
        pointer: { $in: allPointers }
    });
    var allPrimaryFields = crt.findCustomFields({
        pointer: { $in: allPrimaryPointers }
    });

    var fieldsByPointer = keyBy({ items: allFields, byProp: 'pointer' });
    var primaryFieldsByPointer = keyBy({
        items: allPrimaryFields, byProp: 'pointer'
    });

    validateOrThrow({
        schema: FullBodySchema({ availableFields: allPrimaryFields }),
        payload: request.body,
        unmarshalClientTimezone: i18n.timezone,
    });

    var {
        inspectedPointers,
        //offset, limit,
        sort,
    } = request.body;

    var inspectedFields = crt.findCustomFields({
        pointer: { $in: inspectedPointers }
    });

    var PREMATCH = {};
    var GROUP_ID = {};
    var PROJECTION = {};
    for (var it of inspectedPointers) {
        var pair = pointerConfig.map(arrify).find(a => a[0] === it);
        var [ primaryPointer, fallbackPointer ] = pair;

        var primaryPath = convertPointerToPath(primaryPointer);
        var primaryField = primaryFieldsByPointer[primaryPointer];
        var { systemType: primaryType } = primaryField;

        if (fallbackPointer) {
            var fallbackPath = convertPointerToPath(fallbackPointer);
            //var fallbackField = fieldsByPointer[fallbackPointer];
            //var { systemType: fallbackType } = fallbackField;

            PROJECTION['g' + primaryPointer] = { $cond: {
                if: { $eq: [ `$${primaryPath}`, '' ] },
                then: `$${fallbackPath}`,
                else: `$${primaryPath}`
            }}
            PROJECTION[primaryPath] = { $cond: {
                if: { $eq: [ `$${primaryPath}`, '' ] },
                then: `$${fallbackPath}`,
                else: `$${primaryPath}`
            }}
        }
        else {
            if (primaryType === 'Address') {
                PROJECTION['g' + primaryPointer] = { $concat: [
                    `$${primaryPath}.street`,
                    ' ',
                    `$${primaryPath}.housenumber`,
                ]}
            }
            else if (primaryType === 'EmailList') {
                PROJECTION['g' + primaryPointer] = {
                    $first: {
                        $filter: {
                            input: `$${primaryPath}`,
                            as: 'it',
                            cond: { $eq: [ '$$it.isPrimary', true ]}
                        }
                    }
                }
            }
            else if (primaryType === 'PhoneWithTypeList') {
                PROJECTION['g' + primaryPointer] = {
                    $first: {
                        $map: {
                            input: `$${primaryPath}`,
                            as: 'it',
                            in: '$$it.number'
                        }
                    }
                }
            }
            else {
                PROJECTION['g' + primaryPointer] = `$${primaryPath}`;
            }
            
            PROJECTION[primaryPath] = true;
        }

        PREMATCH['g' + primaryPointer] = { $nin: [ '', null ]}
        GROUP_ID[primaryPointer] = `$g${primaryPointer}`;
    }

    var stages = SmartArray([
        match.isNotRemoved({ hasSubChannels: true }),
        match.isNotDummy(),

        { $match: { type: recordType }},
        
        { $project: {
            ...PROJECTION,
            ...crt.getRecordLabelProjection({ as: '_labelData' }),
            'scientific.state.internals.nonDuplicateIds': true,
        }},
        
        { $match: PREMATCH },
        
        { $group: {
            _id: GROUP_ID,
            possibleDuplicates: { $push: '$$ROOT' },
            
            __possibleDuplicateIds: { $push: '$_id' },
            __nonDuplicateIds: { $push: (
                '$scientific.state.internals.nonDuplicateIds'
            )}
        }},
        
        ( sort && { $sort: {
            ['_id.' + convertPathToPointer(sort.path)]: (
                sort.direction === 'asc' ? 1 : -1
            )
        }}),
        

        { $project: {
            _id: true, possibleDuplicates: true,
            
            __size: { $size: '$__possibleDuplicateIds' },
            __possibleDuplicateIds: true,
            __nonDuplicateIds: { $reduce: {
                input: "$__nonDuplicateIds",
                initialValue: [],
                in: { $concatArrays: [ "$$value", "$$this" ] }
            }}
        }},
        
        { $match: { $expr: expressions.hasIntersectionLength({
            sets: [ '$__possibleDuplicateIds', '$__nonDuplicateIds' ],
            $lt: '$__size'
            //$eq: '$__size'
        })}},

        { $project: {
            '__size': false,
            '__possibleDuplicateIds': false,
            '__nonDuplicateIds': false,
        }},

        { $match: {
            'possibleDuplicates.1': { $exists: true }
        }},
        
        { $limit: 100 }
    ]);

    var aggregateItems = await withRetracedErrors(
        aggregateToCursor({
            db, subject: stages, mongoSettings: { allowDiskUse: true }
        }).map(it => it.possibleDuplicates).toArray()
    );

    console.dir(ejson(stages), { depth: null });
    console.log(aggregateItems);

    for (var group of aggregateItems) {
        for (var dup of group) {
            dup._label = crt.getLabelForRecord({
                record: dup, from: '/_labelData', ...i18n
            });
            delete dup._labelData;
        }
    }
    
    var related = await fetchRelated({
        db, records: aggregateItems.flat(), definitions: inspectedFields, i18n
    });

    context.body = ResponseBody({
        data: {
            aggregateItems,
            inspectedFields,
            related: __fixRelated(related, { isResponse: false }),
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
