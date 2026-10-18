'use strict';
var datefns = require('date-fns');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { createCustomQueryValues } = require('../utils');

var createSpecialFilterConditions = (filters, options = {}) => {
    var { timezone = 'UTC', subjectHistoryExperimentIds = [] } = options;
    var {
        labMethods,
        interval,
        studyIds,
        subjectIds,
        isCanceled,
        isPostprocessed,
    } = filters;

    var AND = [];
    if (labMethods && labMethods.length > 0) {
        AND.push({ 'type': { $in: labMethods }});
    }
    // NOTE: date only values are utc midnight but experiment
    // intervals are actual points in time so we need the day
    // boundaries in the clients timezone
    var clientDayStart = (date) => swapTimezone({
        date, sourceTZ: 'UTC', targetTZ: timezone
    });
    if (interval?.start) {
        AND.push({ 'state.interval.start': {
            $gte: clientDayStart(interval.start)
        }});
    }
    if (interval?.end) {
        AND.push({ 'state.interval.start': {
            $lt: clientDayStart(datefns.addDays(interval.end, 1))
        }});
    }

    if (studyIds && studyIds.length > 0) {
        AND.push({ 'state.studyId': { $in: studyIds.map(ObjectId) }});
    }

    // NOTE: this matches the subjects that are shown in the
    // subjects column, see experiment/extendedSearch endpoint
    if (subjectIds && subjectIds.length > 0) {
        var saneSubjectIds = subjectIds.map(ObjectId);
        AND.push({ $or: [
            {
                'state.isPostprocessed': { $ne: true },
                'state.selectedSubjectIds': { $in: saneSubjectIds },
            },
            {
                'state.isPostprocessed': true,
                'state.subjectData': { $elemMatch: {
                    'subjectId': { $in: saneSubjectIds },
                    'participationStatus': 'participated',
                }},
            },
            {
                'state.isCanceled': true,
                '_id': { $in: subjectHistoryExperimentIds },
            },
        ]});
    }

    // NOTE: theese flags are not always set on older records
    // so we cant use DefaultBool here as it requires explicit false
    addBoolCondition(AND, 'state.isCanceled', isCanceled);
    addBoolCondition(AND, 'state.isPostprocessed', isPostprocessed);

    var statics = createCustomQueryValues({
        fields: [
            {
                key: 'experimentOperatorIds',
                pointer: '/state/experimentOperatorIds',
                type: 'ForeignIdList',
                props: { collection: 'personnel' }
            },
        ],
        filters,
    });
    if (Object.keys(statics).length > 0 ) {
        AND.push(statics);
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}

var addBoolCondition = (AND, path, input) => {
    if (input === 'only-true') {
        AND.push({ [path]: true });
    }
    if (input === 'only-false') {
        AND.push({ [path]: { $ne: true }});
    }
}

module.exports = createSpecialFilterConditions;
