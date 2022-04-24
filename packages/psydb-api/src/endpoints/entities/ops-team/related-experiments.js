'use strict';
var jsonpointer = require('jsonpointer');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    merge,
} = require('@mpieva/psydb-core-utils');

var {
    ExactObject,
    Id,
    StringEnum,
    Integer
} = require('@mpieva/psydb-schema-fields');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    resolvePossibleRefs,
    createRecordLabelFromCRT,
    createRecordLabel,

    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    withContext
} = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedExperiments = async (context, next) => {
    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
        SimpleRecordList,
    } = withContext(context);

    augmentWithPayload();

    // validate post params
    await validate({
        createSchema: () => merge(
            Schema(),
            SimpleRecordList.createSchema()
        )
    });

    // check if team exists
    await verifyPayloadId({
        collection: 'experimentOperatorTeam',
        pointer: '/teamId',
    });

    //await verifyPermissions(context)({
    //    collection: 'experimentOperatorTeam',
    //    id: teamId,
    //});

    // find and create listing of experiment records
    var { teamId } = context.payload;
    var data = await SimpleRecordList.fetchData({
        collection: 'experiment',
        filter: { 'state.experimentOperatorTeamId': teamId },
    });
    console.log(data);

    context.body = ResponseBody({ data });
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            teamId: Id({ collection: 'experimentOperatorTeam' }),
        },
        required: [ 'teamId' ]
    });
}

//var itemizeKeys = (bag) => {
//    var { from, key = 'key', merge = false } = bag;
//    return Object.keys(from).map(k => {
//        var value = from[k];
//        return (
//            mergeKey
//            ? { [key]: k, ...value }
//            : { [key]: k, value }
//        );
//    });
//}

module.exports = relatedExperiments;
