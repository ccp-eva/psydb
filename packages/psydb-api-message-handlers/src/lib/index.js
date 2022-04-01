module.exports = {
    SimpleHandler: require('./simple-handler'),
    GenericRecordHandler: require('./generic-record-handler'),

    PushMaker: require('./push-maker'),
    PutMaker: require('./put-maker'),
    RemoveMaker: require('./remove-maker'),

    checkForeignIdsExist: require('./check-foreign-ids-exist'),
    checkCRTFieldPointers: require('./check-crt-field-pointers'),
    createEventMessagesFromProps: (
        require('./create-event-messages-from-props')
    ),
    removeReservationsInInterval: (
        require('./remove-reservations-in-interval')
    ),
}
