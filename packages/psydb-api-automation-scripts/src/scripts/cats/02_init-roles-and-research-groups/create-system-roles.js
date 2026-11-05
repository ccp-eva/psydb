'use strict';
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, ids, idgen } = context;

    seedFakerForNextId({ idgen, collection: 'systemRole' });
    var ra = await driver.systemRole.create({
        name: 'Cat RA', initial: true,
        override: []
    });

    seedFakerForNextId({ idgen, collection: 'systemRole' });
    var scientist = await driver.systemRole.create({
        name: 'Cat Scientist', initial: false,
        override: [
            '/canReadStudies',
            '/canReadParticipation',
            '/canUseCSVExport',
            '/canViewStudyLabOpsSettings',
        ]
    });
    
    seedFakerForNextId({ idgen, collection: 'systemRole' });
    var reception = await driver.systemRole.create({
        name: 'Cat Reception', initial: false,
        override: [
            '/canViewReceptionCalendar',
        ]
    });

    await ids.addByDriverResponse('systemRole', [
        ra, scientist, reception
    ]);
}
