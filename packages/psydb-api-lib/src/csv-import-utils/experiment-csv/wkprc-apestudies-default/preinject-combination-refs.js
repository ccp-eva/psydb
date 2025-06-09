'use strict';
var { sift } = require('@mpieva/psydb-common-lib');
var createCombinationLookup = require('./create-combination-lookup');

var preinjectCombinationRefs = async (bag) => {
    var { db, parsed, subjectType } = bag;

    var combinationLookup = await createCombinationLookup({
        db, parsed, subjectType
    });
    
    for (var p of parsed) {
        var { isValid, obj } = p;
        
        if (!isValid) {
            continue;
        }

        var {
            locationId: locationValue,
            subjectGroupId: subjectGroupValue,
            subjectData
        } = obj;

        for (var d of subjectData) {
            var { subjectId: subjectValue } = d;

            var needle = {
                locationName: locationValue,
                subjectGroupName: subjectGroupValue,
                subjectName: subjectValue
            }
            var found = combinationLookup.filter(sift(needle));

            //console.log({ needle });
            //console.log({ found });

            if (found.length === 1) {
                obj.locationId = found[0].locationId;
                obj.subjectGroupId = found[0].subjectGroupId;
                d.subjectId = found[0]._id;
                
                // FIXME: see make-experiment; push replacements somehow?
                obj.__locationType = found[0].__locationType;
            }
        }
    }
}

module.exports = preinjectCombinationRefs;
