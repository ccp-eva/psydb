'use strict';
var debug = require('debug')('psydb:api:endpoints:apiKey:search');
var { keyBy, unique } = require('@mpieva/psydb-core-utils');

var {
    gatherSubjectTypesFromLabProcedureSettings
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    validateOrThrow,
    ResponseBody,

    fetchAllCRTSettings,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var subjectTypeInfos = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var { studyId } = request.body;
    
    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId,
            }},
            { $project: { _id: true, 'state.subjectTypeKey': true }},
        ]).toArray()
    );
    if (settingRecords.length < 1) {
        throw new ApiError(400, 'StudyHasNoLabProcedureSettings');
    }

    var fromSettings = unique(
        gatherSubjectTypesFromLabProcedureSettings({ settingRecords })
    );

    var fromExistingParticipations = unique(
        await (
            db.collection('subject').aggregate([
                { $match: {
                    [ ppath() + '.studyId' ]: studyId,
                }},
                { $project: {
                    type: true,
                }}
            ]).map(it => it.type).toArray()
        )
    );

    var typeInfo = [];
    for (var it of fromSettings) {
        var out = {
            type: it,
            status: 'available',
        }
        typeInfo.push(out);
    }
    for (var it of fromExistingParticipations) {
        if (fromSettings.includes(it)) {
            continue;
        }

        var out = {
            type: it,
            status: 'residual',
        }
        typeInfo.push(out);
    }

    var allCrtSettings = await fetchAllCRTSettings(db, [{
        collection: 'subject', recordTypes: typeInfo.map(it => it.type)
    }], { wrap: true });

    for (var it of typeInfo) {
        var { type } = it;
        var crtSettings = allCrtSettings.subject[type];

        it.displayFieldDefinitions = (
            crtSettings.augmentedDisplayFields('table')
        )
       
        // FIXME: label => displayName
        var { label: displayName, displayNameI18N } = crtSettings.getRaw();
        it.displayName = displayName;
        it.displayNameI18N = displayNameI18N;
    }

    context.body = ResponseBody({
        data: typeInfo,
    });
}

var ppath = () => (
    'scientific.state.internals.participatedInStudies'
);

module.exports = { subjectTypeInfos };
