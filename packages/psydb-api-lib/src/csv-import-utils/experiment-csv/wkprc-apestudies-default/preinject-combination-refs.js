'use strict';
var { sift } = require('@mpieva/psydb-common-lib');

var createSubjectGroupCombinationView
    = require('./create-subject-group-combination-view');
var createSubjectCombinationView
    = require('./create-subject-combination-view');

var preinjectCombinationRefs = async (bag) => {
    var { db, parsed, subjectType } = bag;

    var subjectGroupView = await createSubjectGroupCombinationView({
        db, parsed, subjectType
    });
    var subjectView = await createSubjectCombinationView({
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

        var needle = {
            locationName: locationValue,
            subjectGroupName: subjectGroupValue,
        }
        var found = subjectGroupView.filter(sift(needle));
        if (found.length === 1) {
            obj.subjectGroupId = found[0]._id;
            obj.locationId = found[0].locationId;
            
            // FIXME: see make-experiment; push replacements somehow?
            obj.__locationType = found[0].__locationType;
        }

        for (var d of subjectData) {
            var { subjectId: subjectValue } = d;

            var needle = {
                locationName: locationValue,
                subjectGroupName: subjectGroupValue,
                subjectName: subjectValue
            }
            var found = subjectView.filter(sift(needle));

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
