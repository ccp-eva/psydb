'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:wkprc-csv-export:participation'
);

var { range, keyBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { CSV, validateOrThrow } = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

var csvExport = async (context, next) => {
    var { db, permissions, request, i18n } = context;
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { studyId, subjectType } = request.body;

    var records = await aggregateToArray({ db, experiment: [
        { $match: {
            $or: [
                { type: 'apestudies-wkprc-default' },
                { realType: 'apestudies-wkprc-default' }
            ],
            'state.studyId': studyId,
            'state.subjectData.subjectType': subjectType, // XXX: no mixed
        }},
    ]});

    var maxSubjectCount = 0;
    var relatedIds = {
        study: [ studyId ], location: [],
        subjectGroup: [], subject: [],
        personnel: [],
    };
    for (var it of records) {
        var {
            locationId,
            subjectGroupId,
            experimentOperatorIds,
            subjectData
        } = it.state;

        relatedIds.location.push(locationId);
        relatedIds.subjectGroup.push(subjectGroupId);
        relatedIds.personnel.push(...experimentOperatorIds);
        relatedIds.subject.push(...subjectData.map(it => it.subjectId));

        if (subjectData.length > maxSubjectCount) {
            maxSubjectCount = subjectData.length;
        }
    }

    var related = {};
    related.study = keyBy({
        items: await aggregateToArray({ db, study: {
            _id: { $in: relatedIds.study }
        }}),
        byProp: '_id',
        transform: it => it.state.shorthand
    });
    related.location = keyBy({
        items: await aggregateToArray({ db, location: {
            _id: { $in: relatedIds.location }
        }}),
        byProp: '_id',
        transform: it => it.state.custom.name
    });
    related.subjectGroup = keyBy({
        items: await aggregateToArray({ db, subjectGroup: {
            _id: { $in: relatedIds.subjectGroup }
        }}),
        byProp: '_id',
        transform: it => it.state.name
    });
    related.personnel = keyBy({
        items: await aggregateToArray({ db, personnel: {
            _id: { $in: relatedIds.personnel }
        }}),
        byProp: '_id',
        transform: it => it.sequenceNumber
    });
    related.subject = keyBy({
        items: await aggregateToArray({ db, subject: {
            _id: { $in: relatedIds.subject }
        }}),
        byProp: '_id',
        //transform: it => it.state.name
        transform: it => it.scientific.state.custom.wkprcIdCode
    });


    var csv = CSV();

    csv.addLine([
        'study_id', 'experiment_name', 'condition',
        'year', 'month', 'day',
        'location', 'room_enclosure',
        'experimenter_id', 'group',
        ...(range(maxSubjectCount).map(ix => `subject_${ix+1}`)),
        ...(range(maxSubjectCount).map(ix => `role_${ix+1}`)),
        'trial_participants',
        ...(range(maxSubjectCount).map(ix => `comment_${ix+1}`)),
    ])

    for (var it of records) {
        var {
            experimentName, conditionName,
            interval,
            locationId, roomOrEnclosure,
            experimentOperatorIds, subjectGroupId,
            totalSubjectCount,
            subjectData,
        } = it.state;

        var expandedSubjectData = range(maxSubjectCount).map(ix => {
            var out = { subject: '', role: '', comment: '' };
            if (subjectData[ix]) {
                out.subject = related.subject[subjectData[ix].subjectId];
                out.role = subjectData[ix].role || '';
                out.comment = subjectData[ix].comment || '';
            }
            return out;
        })

        csv.addLine([
            related.study[studyId],
            experimentName || '',
            conditionName || '',
            ...(interval.start.toISOString().split(/[\-T]/).slice(0,3)),
            related.location[locationId],
            roomOrEnclosure,
            related.personnel[experimentOperatorIds[0]] || '',
            related.subjectGroup[subjectGroupId],

            ...expandedSubjectData.map(it => it.subject),
            ...expandedSubjectData.map(it => it.role),
            totalSubjectCount || '',
            ...expandedSubjectData.map(it => it.comment),
        ])
    }

    context.body = csv.toString();

    await next();
}

module.exports = csvExport;

