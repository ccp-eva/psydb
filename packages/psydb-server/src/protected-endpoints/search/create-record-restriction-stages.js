'use strict';
var inlineString = require('@cdxoo/inline-string');
    
var createRecordRestrictionStages = ({
    allowedResearchGroupIds,
}) => {
    allowedResearchGroupIds = allowedResearchGroupIds || [];

    var recordResearchGroupIdsPath = inlineString`
        $state
        .systemPermissions
        .accessRightsByResearchGroup
        .researchGroupId
    `;

    var hasResearchGroupIntersections = (
        { $gt: [
            { $size: {
                $ifNull: [
                    { $setIntersection: [
                        recordResearchGroupIdsPath,
                        allowedResearchGroupIds,
                    ]},
                    []
                ]
            }},
            0
        ]}
    );

    var isRecordRoot = (
        { $or: [
            { $ifNull: [ '$gdpr', false ]},
            { $ifNull: [ '$scientific', false ]},
        ]}
    );

    var stages = [
        { $redact: {
            $cond: {
                if: isRecordRoot,
                then: '$$DESCEND',
                else: {
                    $cond: {
                        if: hasResearchGroupIntersections,
                        then: '$$KEEP',
                        else: '$$PRUNE'
                    }
                },
            }
        }},
        
        { $match: {
            $or: [
                { state: { $exists: true }},
                { scientific: { $exists: true }},
                { gdpr: { $exists: true }},
            ]
        }},
    ];

    return stages;
};

module.exports = createRecordRestrictionStages;
