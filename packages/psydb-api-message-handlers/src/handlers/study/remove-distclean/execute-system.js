'use strict';
var debug = require('debug')('psydb:api:message-handlers:study/remove-distclean');

var { without } = require('@mpieva/psydb-core-utils');
var { aggregateToIds, aggregateToCursor }
    = require('@mpieva/psydb-mongo-adapter');
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { db, message } = context;
    var { studyId } = message.payload;

    await cleanSubjectInvitations({ db, studyId });
    await cleanSubjectParticipations({ db, studyId  });

    await cleanCSVImports({ db, studyId });
    await cleanExperiments({ db, studyId });

    await cleanRelatedChannels({ db, studyId });
    await cleanStudyChannel({ db, studyId });
}

var cleanStudyChannel = async (bag) => {
    var { db, studyId } = bag;
    debug({ studyId });
    await distcleanManyChannels({ db, study: [ studyId ] });
}

var cleanSubjectParticipations = async (bag) => {
    var { db, studyId } = bag;
    var ppath = 'scientific.state.internals.participatedInStudies';
    
    var participationIds = await aggregateToIds({ db, subject: [
        { $match: { [`${ppath}.studyId`]: studyId }},
        { $unwind: `$${ppath}`},
        { $match: { [`${ppath}.studyId`]: studyId }},
        { $replaceRoot: { newRoot: `$${ppath}`}}
    ]});
    debug({ participationIds });
   
    await withRetracedErrors(
        db.collection('subject').updateMany(
            { [`${ppath}._id`]: { $in: participationIds }},
            { $pull: { [ppath]: { '_id': { $in: participationIds }}}}
        )
    );

    var pushpath = [
        'message.payload', '/$push',
        '/scientific/state/internals/participatedInStudies', '/_id'
    ].join('.');
    
    var pullpath = [
        'message.payload', '/$pull',
        '/scientific/state/internals/participatedInStudies','/_id'
    ].join('.');

    await deleteManyRecords({
        db, rohrpostEvents: { $or: [
            { [pushpath]: { $in: participationIds }},
            { [pullpath]: { $in: participationIds }},
        ]}
    })
}

var cleanSubjectInvitations = async (bag) => {
    var { db, studyId } = bag;
    var ipath = 'scientific.state.internals.invitedForExperiments';

    // XXX: we unset based on array index an need to find a workaround
    // to properly clean the stuff w/o breaking history
    //var invitations = await aggregateToArray({ db, subject: [
    //    { $match: { [`${ppath}.studyId`]: studyId }},
    //    { $unwind: `$${ppath}`},
    //    { $match: { [`${ppath}.studyId`]: studyId }},
    //    { $replaceRoot: { newRoot: `$${ppath}`}}
    //]});
}

var cleanCSVImports = async (bag) => {
    var { db, studyId } = bag;
    
    var csvImportIds = await aggregateToIds({
        db, csvImport: { 'studyId': studyId }
    });
    debug({ csvImportIds });
    
    await distcleanManyChannels({
        db, csvImport: csvImportIds
    });
}

var cleanExperiments = async (bag) => {
    var { db, studyId } = bag;
    
    var experimentIds = await aggregateToIds({
        db, experiment: { 'state.studyId': studyId }
    });
    debug({ experimentIds });
    
    await distcleanManyChannels({
        db, experiment: experimentIds
    });
}

var cleanRelatedChannels = async (bag) => {
    var { db, studyId } = bag;

    var labTeamIds = await aggregateToIds({
        db, experimentOperatorTeam: { 'studyId': studyId }
    });
    debug({ labTeamIds });
    
    await distcleanManyChannels({
        db, experimentOperatorTeam: labTeamIds
    });


    var experimentVariantIds = await aggregateToIds({
        db, experimentVariant: { 'studyId': studyId }
    });
    debug({ experimentVariantIds });
    
    await distcleanManyChannels({
        db, experimentVariant: experimentVariantIds
    });
   

    var experimentVariantSettingIds = await aggregateToIds({
        db, experimentVariantSetting: { 'studyId': studyId }
    });
    debug({ experimentVariantSettingIds });

    await distcleanManyChannels({
        db, experimentVariantSetting: experimentVariantSettingIds
    });
    
}

var deleteManyRecords = (bag) => {
    var { db, ...rest } = bag;
    var [ collection, filter ] = Object.entries(rest)[0];

    return withRetracedErrors(
        db.collection(collection).deleteMany(filter)
    )
}

var distcleanManyChannels = async (bag) => {
    var { db, ...rest } = bag;
    var [ collection, ids ] = Object.entries(rest)[0];

    await deleteManyRecords({ db, [collection]: {
        _id: { $in: ids }
    }});

    var correlationIds = await aggregateToCursor({ db, rohrpostEvents: {
        'collectionName': collection,
        'channelId': { $in: ids }
    }}).map(it => it.correlationId).toArray();

    await deleteManyRecords({ db, rohrpostEvents: {
        'collectionName': collection,
        'channelId': { $in: ids }
    }});

    var keepCorrelationIds = await aggregateToCursor({ db, rohrpostEvents: {
        'correlationId': { $in: correlationIds }
    }}).map(it => it.correltionId).toArray();

    var todoCorrelationIds = without({
        that: correlationIds, without: keepCorrelationIds
    });

    debug({ keepCorrelationIds });
    debug({ todoCorrelationIds });

    await deleteManyRecords({ db, mqMessageHistory: {
        _id: { $in: todoCorrelationIds }
    }});

}

module.exports = { executeSystemEvents }
