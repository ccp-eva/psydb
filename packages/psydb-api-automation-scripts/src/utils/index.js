module.exports = {
    createOnePersonnelRecord: require('./create-one-personnel-record'),
    initDB: require('./init-db'),
    fetchCRTs: require('./fetch-crts'),
    gatherLabeledIds: require('./gather-labeled-ids'),
    gatherRefCache: require('./gather-ref-cache'),
    PointerGen: require('./pointer-gen'),
    FixedIdGen: require('./fixed-id-gen'),
    getSeedForDocId: require('./get-seed-for-doc-id'),
    seedFakerForNextId: require('./seed-faker-for-next-id'),
}
