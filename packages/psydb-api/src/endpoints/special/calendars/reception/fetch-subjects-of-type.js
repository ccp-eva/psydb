var fetchSubjectsOfType = async (context, options) => {
    var { db } = context;
    var { subjectTypeKey } = options;

    var subjectTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectTypeKey,
    });

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: subjectTypeRecord,
    });

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    // TODO: theese fields needs a flag of some kind so that they are allowed
    // to be shown here
    // find the first PhoneList field
    var phoneListField = (
        subjectTypeRecord.state.settings.subChannelFields.gdpr
        .find(field => {
            return (field.type === 'PhoneList');
        })
    );

    var subjectRecords = await (
        db.collection('subject').aggregate([
            { $match: {
                _id: { $in: subjectIds }
            }},
            StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    type: true,
                }
            }),
        ]).toArray()
    );

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectTypeKey,
        records: subjectRecords
    })

}


