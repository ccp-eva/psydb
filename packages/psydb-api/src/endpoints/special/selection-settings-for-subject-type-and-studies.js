'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:selectionSettingsForSubjectTypeAndStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    SystemPermissionStages,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');

var {
    SubjectSelectionSettingsListItemOption,
} = require('@mpieva/psydb-schema-fields-special');


var selectionSettingsForSubjectTypeAndStudies = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        subjectRecordType,
        studyIds,
    } = request.body;

    // TODO: obsolete=
    // TODO: check body + unmarshal

    var studySelectionSettings = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        ...SystemPermissionStages({ permissions }),
        StripEventsStage(),
        { $unwind: '$state.selectionSettingsBySubjectType' },
        { $project: {
            'state.name': true,
            'state.shorthand': true,
            'state.selectionSettingsBySubjectType': true
        }},
        { $match: {
            'state.selectionSettingsBySubjectType.subjectRecordType': (
                subjectRecordType
            )
        }},
        { $group: {
            _id: '$_id',
            'studyName': { $first: '$state.name' },
            'studyShorthand': { $first: '$state.shorthand' },
            // NOTE: we use first here since there can only be one
            // item per type
            'selectionSettingsBySubjectType': { $first: (
                '$state.selectionSettingsBySubjectType'
            )}
        }},
        // FIXME: no dots allowed in $group stage
        /*{ $project: {
            'state.name': '$name',
            'state.selectionSettingsBySubjectType': (
                '$selectionSettingsBySubjectType'
            )
        }},*/
        { $addFields: {
            studyId: '$_id',
        }}
    ]).toArray()

    var subjectRecordTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectRecordType,
    });


    var data = {
        items: studySelectionSettings.map(it => (
            it.selectionSettingsBySubjectType
        ))
    };

    var schema = {
        // FIXME: wrapping object is only because
        // resolver cant handle root level array
        type: 'object',
        properties: {
            items: {
                type: 'array',
                items: SubjectSelectionSettingsListItemOption({
                    subjectRecordTypeRecord
                })
            }
        }
    }

    //console.dir(schema, { depth: null });
    //throw new Error();

    var {
        relatedRecords,
        relatedHelperSetItems
    } = await fetchRelatedLabels({
        db,
        data,
        schema,
    });

    //console.log(relatedRecords);
    //console.log(relatedHelperSetItems);
    //throw new Error();

    context.body = ResponseBody({
        data: {
            studySelectionSettings,
            scientificFieldDefinitions: (
                subjectRecordTypeRecord.state.settings.subChannelFields.scientific
            ),
            relatedRecords,
            relatedHelperSetItems,
        }
    })

    await next();
};

module.exports = selectionSettingsForSubjectTypeAndStudies;
