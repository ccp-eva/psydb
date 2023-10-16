'use strict';
var { hasSome } = require('@mpieva/psydb-core-utils');
var { SmartArray } = require('@mpieva/psydb-common-lib');

var {
    QuickSearchStages,
    MatchConstraintsStage,

    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage,
} = require('../search-utility-stages');

// FIXME: naming theese mostly reduce the result set by match conditions
// maybe FilterStages or MatcherStages?
var SearchBaseStages = (bag = {}) => {
    var {
        queryFields = [],
        fieldTypeConversions,

        constraints = {},
        onlyIds = undefined,
        excludedIds = [],
        showHidden = false,
    } = bag;

    return SmartArray([
        isNotDummyStage(),
        isNotRemovedStage(),
        
        Array.isArray(onlyIds) && { $match: {
            _id: { $in: onlyIds }
        }},

        hasSome(excludedIds) && { $match: {
            _id: { $nin: excludedIds }
        }},

        !showHidden && (
            isNotHiddenStage()
        ),

        hasSome(Object.keys(constraints)) && (
            MatchConstraintsStage({
                constraints, __sanitize_$in: true
            })
        ),

        hasSome(queryFields) && (
            QuickSearchStages({ queryFields, fieldTypeConversions })
        ),
    ], { spreadArrayItems: true })
}

module.exports = SearchBaseStages;
