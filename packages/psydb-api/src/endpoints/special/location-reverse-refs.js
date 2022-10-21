'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:locationReverseRefs'
);

var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var intervalfns = require('@mpieva/psydb-date-interval-fns');

var {
    keyBy,
    groupBy,
    unique,
    ejson,
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyRecordExists,
    fetchRecordReverseRefs,
    fetchCRTSettings,
    createRecordLabel,
} = require('@mpieva/psydb-api-lib');

var {
    SeperateRecordLabelDefinitionFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    StringEnum,
    Id,
} = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: {
        id: Id(),
    },
    required: [
        'id',
    ]
})

var reverseRefs = async (context, next) => {
    var { 
        db,
        permissions,
        params,
        request,
    } = context;

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    });
    
    var { id: locationId } = params;

    var canAccess = (
        permissions.hasCollectionFlag('location', 'remove')
    );

    if (!canAccess) {
        throw new ApiError(403);
    }

    await verifyRecordExists({
        db,
        collection: 'location',
        recordId: locationId,
    });

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: locationId,
        refTargetCollection: 'location'
    });

    var groupedReverseRefs = groupBy({
        items: reverseRefs,
        byProp: 'collection'
    });
    var reverseRefsWithLabel = [];
    for (var collection of Object.keys(groupedReverseRefs)) {
        var collectionCreatorData = allSchemaCreators[collection];
        var collectionReverseRefs = groupedReverseRefs[collection];

        var { hasCustomTypes } = collectionCreatorData;
        if (hasCustomTypes) {
            var crtKeys = unique(collectionReverseRefs.map(it => it.type));
            var crts = await (
                db.collection('customRecordType').find(
                    { 
                        collection,
                        type: { $in: crtKeys }
                    },
                    { projection: {
                        type: true,
                        'state.recordLabelDefinition': true
                    }}
                ).toArray()
            );
            
            var crtsByType = keyBy({
                items: crts,
                byProp: 'type'
            });
            
            var crtReverseRefs = groupBy({
                items: collectionReverseRefs,
                byProp: 'type',
            });

            for (var key of crtKeys) {
                var augmented = await fetchLabeledRefs({
                    db,
                    collection,
                    recordLabelDefinition: (
                        crtsByType[key].state.recordLabelDefinition
                    ),
                    reverseRefs: crtReverseRefs[key],
                    locationId
                });

                reverseRefsWithLabel.push(...augmented);
            }
        }
        else {
            var { recordLabelDefinition } = collectionCreatorData;
            
            var augmented = undefined;
            if (recordLabelDefinition || collection === 'experiment') {
                augmented = await fetchLabeledRefs({
                    db,
                    collection,
                    recordLabelDefinition,
                    reverseRefs: collectionReverseRefs,
                    locationId,
                });
            }
            else {
                augmented = collectionReverseRefs.map(it => ({
                    ...it,
                    _recordLabel: it._id
                }));
            }
            
            reverseRefsWithLabel.push(...augmented);
        }
    }

    //console.dir(ejson(reverseRefsWithLabel), { depth: null });

    context.body = ResponseBody({
        data: {
            reverseRefs: reverseRefsWithLabel
        }
    });

    await next();
}

var fetchLabeledRefs = async (options) => {
    var {
        db,
        collection,
        recordLabelDefinition,
        reverseRefs,
        locationId
    } = options;

    // FIXME: we need label caching on record
    if (collection === 'experiment') {
        var upcomingExperiments = await (
            db.collection('experiment').aggregate([
                { $match: {
                    _id: { $in: reverseRefs.map(it => it._id )},
                    'state.isPostprocessed': { $ne: true },
                    'state.isCanceled': { $ne: true },
                }},
                { $project: {
                    _id: true,
                    type: true,
                    realType: true,
                    'state.interval': true,
                    'state.studyId': true
                }}
            ]).toArray()
        );

        var upcomingRefs = await postprocessExperimentRefs({
            ...options,
            experiments: upcomingExperiments
        });

        var participatedExperiments = await (
            db.collection('experiment').aggregate([
                { $match: {
                    _id: { $in: reverseRefs.map(it => it._id )},
                    'state.isPostprocessed': true,
                    'state.isCanceled': { $ne: true },
                    'state.subjectData.participationStatus': 'participated',
                }},
                { $project: {
                    _id: true,
                    type: true,
                    realType: true,
                    'state.interval': true,
                    'state.studyId': true
                }}
            ]).toArray()
        );

        var participatedRefs = await postprocessExperimentRefs({
            ...options,
            experiments: participatedExperiments
        });

        participatedRefs = participatedRefs.map(it => ({
            ...it,
            collection:  '_participation'
        }));

        return [ ...upcomingRefs, ...participatedRefs ]
    }
    else {
        return await fetchVanillaReverseRefs(options);
    }
}

var postprocessExperimentRefs = async (bag) => {
    var {
        db,
        collection,
        recordLabelDefinition,
        reverseRefs,

        experiments,
    } = bag;

    var studies = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: experiments.map(it => it.state.studyId) }
            }},
            { $project: {
                'state.shorthand': true
            }}
        ]).toArray()
    );

    var studiesById = keyBy({
        items: studies,
        byProp: '_id'
    });

    var isRelevant = {};
    var labels = {};
    var realTypes = {};
    for (var it of experiments) {
        var { _id, type, realType, state: { interval, studyId }} = it;

        type = type === 'manual' ? realType : type

        var study = studiesById[studyId];
        
        var typeLabel = {
            'inhouse': 'Intern',
            'away-team': 'Extern',
            'online-video-call': 'Video',
        }[type];

        var formatted = intervalfns.format(interval);

        isRelevant[_id] = true;
        realTypes[_id] = type;
        labels[_id] = inline`
            ${formatted.startDate}
            ${study.state.shorthand}
            (${typeLabel})
        `;
    }

    return (
        reverseRefs.filter(it => isRelevant[it._id]).map(it => ({
            ...it,
            type: realTypes[it._id],
            _recordLabel: labels[it._id],
        }))
    )
}

var fetchVanillaReverseRefs = async (bag) => {
    var {
        db,
        collection,
        recordLabelDefinition,
        reverseRefs,
    } = bag;

    var result = await (
        db.collection(collection).aggregate([
            { $match: {
                _id: { $in: reverseRefs.map(it => it._id )}
            }},
            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition
            }),
            { $project: {
                _id: true,
                '_recordLabelDefinitionFields': true
            }}
        ]).toArray()
    );

    var resultsById = keyBy({
        items: result,
        byProp: '_id',
    });

    return (
        reverseRefs.map(it => ({
            ...it,
            _recordLabel: createRecordLabel({
                record: resultsById[it._id]._recordLabelDefinitionFields,
                definition: recordLabelDefinition
            })
        }))
    )
}

module.exports = reverseRefs;
