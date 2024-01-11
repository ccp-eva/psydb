'use strict';
var { ejson, convertPointerToPath } = require('@mpieva/psydb-core-utils');

var {
    timeshiftAgeFrame,
    fieldTypeMetadata
} = require('@mpieva/psydb-common-lib');

var {
    convertFiltersToQueryFields,
    SmartArray
} = require('@mpieva/psydb-api-lib');

var {
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
    QuickSearchStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fieldTypeConversions = (
    require('@mpieva/psydb-api-lib/src/mongodb-field-type-conversions')
);

var createPreCountStages = (bag) => {
    var {
        interval,
        timezone,
        sampleSize,
        ageFrameFilters,
        ageFrameValueFilters,
        quickSearchFilters,
        
        studyTypeKey,
        studyTypeRecord,
        studyIds,
        studyRecords,

        subjectTypeKey,
        subjectTypeRecord,
        subjectRecordLabelDefinition,

        experimentVariant,
        dobFieldPointer,
        queryFields
    } = bag;

    console.log({ sampleSize })

    var queryFields = convertFiltersToQueryFields({
        filters: quickSearchFilters || {},
        displayFields: subjectRecordLabelDefinition.tokens,
        fieldTypeMetadata,
    });

    var preCountStages = SmartArray([
        { $match: {
            type: subjectTypeKey,
            isDummy: false,
            'scientific.state.systemPermissions.isHidden': { $ne: true },
            'scientific.state.internals.isRemoved': { $ne: true }
        }},
        // NOTE: prefiltering possbile age frames to make index use easier
        // and get better performance
        (ageFrameFilters.length > 0) && (
            { $match: { $or: (
                ageFrameFilters.map(it => {
                    var p = convertPointerToPath(dobFieldPointer);
                    var shifted = timeshiftAgeFrame({
                        targetInterval: interval,
                        ageFrame: it.interval
                    });
                        
                    return { $and: [
                        { [p]: { $gte: shifted.start }},
                        { [p]: { $lt: shifted.end }},
                    ]}
                })
            )}}
        ),

        // TODO: quicksearch
        ...QuickSearchStages({
            queryFields, 
            fieldTypeConversions,
        }),

        // TODO: optimization
        // first match children that ar in any of the timeshifted
        // age frames; this should reduce the size enough most of the time
        AddSubjectTestabilityFieldsStage({
            experimentVariant,
            interval,
            // timezone, // XXX
            ageFrameFilters,
            ageFrameValueFilters,

            subjectTypeKey,
            subjectTypeRecord,
            studyRecords,

            // TODO: ageframe custom verrides
            // TODO: global study settings filters in stage itself
        }),
        HasAnyTestabilityStage({
            studyIds
        }),
        
        (sampleSize > 0 && { $sample: { size: sampleSize }}),
    ]);

    return preCountStages;
}

module.exports = createPreCountStages;
