'use strict';

var fetchTeamName = async ({ db, personnelIds }) => {
    var personnelRecords = await (
        db.collection('personnel').aggregate([
            { $match: {
                _id: { $in: personnelIds },
            }},
            { $project: {
                'gdpr.state.lastname': true,
                'gdpr.state.firstname': true,
            }},
            { $sort: {
                'gdpr.state.lastname': 1
            }}
        ], { collation: 'de@collation=phonebook' }).toArray()
    );

    var teamName = (
        personnelRecords
        .map(it => {
            var { firstname, lastname } = it.gdpr.state;
            return `${lastname}, ${firstname}`;
        })
        .join('; ')
    );

    return teamName;
}

module.exports = {
    fetchTeamName
}
