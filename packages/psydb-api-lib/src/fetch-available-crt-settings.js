'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var { SmartArray } = require('@mpieva/psydb-common-lib');

var withRetracedErrors = require('./with-retraced-errors');
var aggregateToArray = require('./aggregate-to-array');
var aggregateOne = require('./aggregate-one');
var allCRTCollections = require('./all-crt-collections');
var fetchAllCRTSettings = require('./fetch-all-crt-settings');

var onlykey = it => it.key


var fetchAvailableCRTSettings = async (bag) => {
    var {
        db,
        permissions,
        collections,
        byStudyId = undefined,
        
        wrap,
        asTree
    } = bag;
    
    var availableTypesByCollection = undefined;
    if (byStudyId) {
        // FIXME: should we check study acccess here and also
        // how would we even do that?
        var study = await withRetracedErrors(
            aggregateOne({ db, study: [
                { $match: { _id: byStudyId }}
            ]})
        );

        availableTypesByCollection = await fetchCRTKeysForResearchGroups({
            db, researchGroupIds: study.state.researchGroupIds
        })
    }
    else {
        // TODO: maybe move that into permissions itself
        availableTypesByCollection = {
            'subject': permissions.availableSubjectTypes.map(onlykey),
            'study': permissions.availableStudyTypes.map(onlykey),
            'location': permissions.availableLocationTypes.map(onlykey),
            'externalPerson': 'ALL', // FIXME
            'externalOrganization': 'ALL', // FIXME
        }
    }
    
    var filter = collections.map(it => {
        var recordTypes = availableTypesByCollection[it];
        return {
            collection: it,
            ...(recordTypes !== 'ALL' && { recordTypes })
        }
    });

    var crts = await fetchAllCRTSettings(db, [
        ...filter
    ], { wrap, asTree });

    return crts;
}

var fetchCRTKeysForResearchGroups = async (bag) => {
    var { db, researchGroupIds } = bag;

    var researchGroups = await withRetracedErrors(
        aggregateToArray({ db, researchGroup: [
            { $match: {
                _id: { $in: researchGroupIds }
            }}
        ]})
    );
    
    var subjectTypes = unique(SmartArray([
        ...researchGroups.map(it => it.state.subjectTypes)
    ], { spreadArrayItems: true }).map(it => it.key));
    
    var studyTypes = unique(SmartArray([
        ...researchGroups.map(it => it.state.studyTypes)
    ], { spreadArrayItems: true }).map(it => it.key));
    
    var locationTypes = unique(SmartArray([
        ...researchGroups.map(it => it.state.locationTypes)
    ], { spreadArrayItems: true }).map(it => it.key));

    return {
        subject: subjectTypes,
        study: studyTypes,
        location: locationTypes,
        externalPerson: [], // FIXME
        externalOrganization: [], // FIXME
    }
}

module.exports = fetchAvailableCRTSettings;
