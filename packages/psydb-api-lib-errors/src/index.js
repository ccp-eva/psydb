class InvalidCollection extends Error {};
class RecordTypeRequired extends Error {};
class RecordTypeNotFound extends Error {};

module.exports = {
    InvalidCollection,
    RecordTypeRequired,
    RecordTypeNotFound
}
