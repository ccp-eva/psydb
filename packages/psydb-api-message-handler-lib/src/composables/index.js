module.exports = {
    ...require('./verify-one-crt'),
    ...require('./verify-one-record'),
    ...require('./verify-one-record-access'),
    // FIXME: verify-one-record-not-referenced ???
    ...require('./verify-no-reverse-refs'),
}
