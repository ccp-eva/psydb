
var params = {
    filter: {
        'start': '2021-10-01'
        'end': '2021-10-30'
    },
    studyId: 12345 // optional
}

if (studyId) {
    var study = fetchStudy(studyId);
    var sharedResearchGroupIds = intersect(
        yourResearchGroupIds,
        studyResearchGroupIds
    );
    if (shared.length < 0) {
        throw new PermissionDenied(),
    }
    else {
        var researchGroupPermissions = fetchResearchGroupRoles(sharedResearchGroupIds);
        // [ { researchGroupId, permissions: { ... } } ]

        var mergedPermissions = mergePermissions(roles);
        fetchWithPermissions({ researchGroupPermissions  });
    }
}
else {
    fetchWithPermissions({ permissions: userPermissions })
}



var fetrchWithPermissions = async () => {
    await db.collection(collection).aggregate([
        
    ])
}


// study participation summary
// paricipation date | subject-label | location-label
// => studyId

searchParticipations({ studyId: 12345, filter });

searchSubjects({ filter, labelOnly: false });

var searchSubjects = ({ filter }) => {
    var studies = fetchAllowedStudies({ me });
    var locationTypes = fetchTypesWithForeignId({})
}

// Alice | 01.01.1970 | ... |
// Bob   | Redacted         |       


searchSubjectsForTesting = ({ studyId, filter, searchType }) => {
    if (searchType === 'inhouse') {
        var study = fetchStudy({ studyId });
        var reseachGroupIds = study.state.researchGroupIds;
        var permissionCondition = {
            'state.testingPermissions.researchGroupId': {
                $in: researchGroupIds
            },
        }
        // perform the query with the proper study/modified study filter
        // maybe use deep-diff to find/apply the allowed filter modificatons
    }
    else if (searchType === 'external') {
        var study = fetchStudy({ studyId });
        var enabledExternalLocationTypes = (
            study.state.locationTypeSettings.filter(
                it => it.searchType === 'external'
            )
        );
        // TODO: WHICH LOCATION REF FOR GROUPING?
        // es wäre besser wenn wir für diese sache
        // pro subjekt typ das feld wählen an dem gruppiert werden soll
        // ausserdem muss ich bei ggf auswählen welcher subjekt typ gesucht werden soll
        // weil es sich widersprechende location-groupings geben kann
        // i.e. ich kann eigentlich nur gleiche location types zulassen
        // bei kombinationssuchen
        // e.g. T=school fpr lehrer und schulkinder
    }
}
