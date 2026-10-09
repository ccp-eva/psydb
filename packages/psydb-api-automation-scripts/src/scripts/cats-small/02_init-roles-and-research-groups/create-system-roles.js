'use strict';

module.exports = async (context) => {
    var { driver, ids } = context;

    var ra = await driver.systemRole.create({
        name: 'Cat RA', initial: true,
        override: []
    });

    var scientist = await driver.systemRole.create({
        name: 'Cat Scientist', initial: false,
        override: [
            '/canReadStudies',
            '/canReadParticipation',
            '/canUseCSVExport',
            '/canViewStudyLabOpsSettings',
        ]
    });
    
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
