'use strict';
var inline = require('@cdxoo/inline-text');

var makeTestingPermissionSubConditions = ({
    researchGroupIds,
    experimentVariant
}) => {
    var inputField = {
        'inhouse': 'canBeTestedInhouse',
        'away-team': 'canBeTestedByAwayTeam',
        'online-video-call': 'canBeTestedInOnlineVideoCall',
        //'online-survey': 'canBeTestedInOnlineSurvey',
        'online-survey': 'canBeTestedOnline',
    }[experimentVariant];

    if (!inputField) {
        throw new Error(inline`
            experimentVariant should be one of
            ['inhouse', 'away-team', 'online'] but
            "${experimentVariant}" was given
        `)
    }

    var inputPath = `$scientific.state.testingPermissions.${inputField}`;

    var subConditions = (
        // is the child allowed to be tested by the studies researchgroups
        // we currently require at least one group
        researchGroupIds.map(groupId => ({
            $gt: [
                { $size: {
                    $filter: {
                        // XXX inhouse fixed
                        input: inputPath,
                        as: 'item',
                        cond: { $and: [
                            { $eq: [ '$$item.researchGroupId', groupId ]},
                            { $eq: [ '$$item.permission', 'yes' ]}
                        ]}
                    }
                }},
                0,
            ]
        }))
    )

    return subConditions;
}

module.exports = makeTestingPermissionSubConditions;
