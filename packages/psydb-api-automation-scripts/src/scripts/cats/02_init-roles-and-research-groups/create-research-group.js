'use strict';
var { Fields } = require('@mpieva/psydb-faker');

module.exports = async (context) => {
    var { driver, ids } = context;

    var catlab = await driver.researchGroup.create({ data: { state: {
        name: 'Center for Cat Research',
        shorthand: 'Cat-Lab',
        address: Fields.Address(),
        description: Fields.FullText(),

        labMethods: [
            'inhouse',
            'away-team',
        ],
        studyTypes: [
            { key: 'catStudy' },
        ],
        subjectTypes: [
            { key: 'catOwner' },
            { key: 'cat' },
        ],
        locationTypes: [
            { key: 'instituteroom' },
            { key: 'catShelter' },
        ],
        helperSetIds: [
            ids(/HS Acquisition .Cat Owners./),
            ids(/HS Rearing History .Cats./),
        ],
        systemRoleIds: [
            ids('systemRole', 'Cat RA'),
            ids('systemRole', 'Cat Scientist'),
            ids('systemRole', 'Cat Reception'),
        ],
        adminFallbackRoleId: ids('systemRole', 'Cat RA'),
    }}});

    await ids.addByDriverResponse('researchGroup', catlab);
}

