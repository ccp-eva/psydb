'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;
    
    await driver.systemRole.create({
        name: 'Uganda Scientist', initial: false,
        override: [
            '/canUseExtendedSearch',
            '/canUseCSVExport',
            
            '/canReadSubjects',
            '/canWriteSubjects',
            '/canRemoveSubjects',
            
            '/canReadSubjects',
            
            '/canReadLocations',
            '/canWriteLocations',
            '/canRemoveLocations',
            
            '/canReadHelperSets',
            '/canWriteHelperSets',
            '/canRemoveHelperSets',
            
            '/canReadParticipation',
            '/canWriteParticipation',
        ]
    });
    cache.addId({ collection: 'systemRole', as: 'fs_uganda_scientist' });
}
