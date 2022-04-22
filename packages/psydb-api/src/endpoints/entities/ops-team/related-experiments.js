var relatedExperiments = async (context, next) => {
    augmentWithPayload(context);

    // validate post params
    validate(context)({
        createSchema: Schema
    });

    var { teamId } = payload;

    // check if team exists
    await verifyId(context)({
        collection: 'experimentOperatorTeam',
        id: teamId,
    });

    await verifyPermissions(context)({
        collection: 'experimentOperatorTeam',
        id: teamId,
    });

    // find and create listing of experiment records
    var data = await fetchSimpleRecordList(context)({
        collection: 'experiment',
        filter: { 'state.experimentOperatorTeamId': teamId },
    })
    context.body = ResponseBody({ data });

    await next();
}

var Schema = () => {
    return merge(
        ExactObject({
            properties: {
                teamId: Id({ collection: 'experimentOperatorTeam' }),
            },
            required: [ 'teamId' ]
        }),
        SimpleRecordListSchema()
    );
}

var SimpleRecordListSchema = () => {
    return ExactObject({
        properties: {
            out: StringEnum([ 'count', 'id-only', 'full' ]),
            limit: Integer({ minimum: 0 }),
            offset: Integer({ minimum: 1 }),
        },
        required: [ 'out' ]
    })
}

var augmentWithPayload = (context, type) => {
    var pointer = (
        type === 'get'
        ? '/params'
        : '/request/body'
    );
    context.payload = jsonpointer.get(context, pointer);
}

var validate = (context) => async (options) => {
    var { payload } = context;

    validateOrThrow({
        schema: createSchema(),
        payload
    });
}

var fetchSimpleRecordList = (context) => async (options) => {
    var { payload } = context;

    var { out, limit, offset } = payload;
    var { collection, filter } = options;


}
