'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;
    
    await driver.systemRole.create({
        name: 'Cat RA', initial: true,
        override: []
    });
    cache.addId({ collection: 'systemRole', as: 'cat_ra' });
    
    await driver.systemRole.create({
        name: 'Cat Scientist', initial: false,
        override: [
            '/canReadStudies',
            '/canReadParticipation',
            '/canUseCSVExport',
            '/canViewStudyLabOpsSettings',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'cat_scientist' });
    
    await driver.systemRole.create({
        name: 'Cat Reception', initial: false,
        override: [
            '/canViewReceptionCalendar',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'cat_reception' });
}
