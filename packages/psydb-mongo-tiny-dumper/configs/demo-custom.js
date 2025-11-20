module.exports = {
    url: 'mongodb://127.0.0.1:47017/psydb',

    customDumpFN: async (bag) => {
        var { aggregateToArray, aggregateToCursor, dump } = bag;

        var users = await aggregateToArray({ personnel: {
            'gdpr.state.emails.email': { $in: [
                "root@example.com",
            ]}
        }, track: true });

        await aggregateToCursor({ apiKey: {
            'userId': { $in: users.map(it => it._id) }
        }, track: true });
        
        await dump();
    },
}
