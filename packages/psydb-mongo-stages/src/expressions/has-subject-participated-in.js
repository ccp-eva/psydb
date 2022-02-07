'use strict';
var hasIntersection = require('./has-intersection');

var hasSubjectParticipatedIn = ({ studyIds }) => {
    var path = '$scientific.state.internals.participatedInStudies';
    return hasIntersection({ sets: [
        { $map: {
            input: { $filter: {
                input: path,
                cond: { $in: [
                    '$$this.status',
                    [ 'participated' ]
                ]}
            }},
            in: '$$this.studyId'
        }},
        studyIds
    ]});
}

module.exports = hasSubjectParticipatedIn;
