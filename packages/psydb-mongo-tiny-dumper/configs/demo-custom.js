module.exports = {
    url: 'mongodb://127.0.0.1:47017/psydb',
    customDumpFN: async (bag) => {
        var { aggregateToArray, aggregateToCursor, dump } = bag;
        
        var staff = await aggregateToArray({ personnel: [
            { $match: {
                'gdpr.state.emails.email': { $in: [
                    "root@example.com",
                ]}
            }}
        ], track: true });

        await aggregateToCursor({ apiKey: [
            { $match: {
                'personnelId': { $in: staff.map(it => it._id) }
            }}
        ], track: true });

        await dump();
    }
}
