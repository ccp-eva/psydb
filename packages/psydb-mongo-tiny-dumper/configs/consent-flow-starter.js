module.exports = {
    url: 'mongodb://127.0.0.1:47017/psydb',

    customDumpFN: async (bag) => {
        var { aggregateToArray, aggregateToCursor, dump } = bag;

        await aggregateToCursor({ personnel: {
            'gdpr.state.emails.email': { $in: [
                "root@example.com",
            ]}
        }, track: true });

        await aggregateToCursor({ customRecordType: {
            $or: [
                { 'collection': 'study', 'type': 'default' },
                { 'collection': 'subject', 'type': 'child' }
            ]
        }, track: true });

        await aggregateToCursor({ study: {
            'state.shorthand': { $in: [
                'IH-Study'
            ]}
        }, track: true });

        await dump();
    },
}
