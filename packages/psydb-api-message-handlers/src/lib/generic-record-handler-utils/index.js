module.exports = {
    ...require('./parse-record-message-type'),
    ...require('./destructure-message'),
    ...require('./open-channel'),
    ...require('./maybe-update-foreign-id-targets'),
}
