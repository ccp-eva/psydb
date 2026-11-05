module.exports = {
    url: 'mongodb://127.222.0.1:47017/psydb',

    collections: {
        personnel: `
            { 'gdpr.state.emails.email': { $in: [
                "root@example.com",
            ]}}
        `,
    }
}
