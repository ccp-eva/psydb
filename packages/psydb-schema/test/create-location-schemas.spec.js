'use strict';
var expect = require('chai').expect,
    inspect = require('./helpers/inspect'),
    custom = require('./fixtures/custom-locations/'),
    createSchemas = (
        require('../src/collection/location/create-all-schemas')
    );

describe('createLocationSchemas()', () => {
    it('generates full schema structure based on custom schemas', () => {
        var schemas = createSchemas({
            customBuildingItems: [
                {
                    key: 'kindergarden',
                    schema: custom.building.kindergarden,
                },
                {
                    key: 'school',
                    schema: custom.building.school
                }
            ],
            customRoomItems: [
                {
                    key: 'default-room',
                    schema: custom.room.default,
                },
            ],
            customGenericLocationItems: [
                {
                    key: 'gps',
                    schema: custom.gps,
                },
            ],
        });

        //inspect(schemas);

        expect(schemas)
            .to.have.property('building')
            .that.is.an('object');
        expect(schemas)
            .to.have.property('room')
            .that.is.an('object');
        expect(schemas)
            .to.have.property('gps')
            .that.is.an('object');
        
        expect(schemas.building)
            .to.have.property('kindergarden')
            .that.is.an('object');
        expect(schemas.building)
            .to.have.property('school')
            .that.is.an('object');
        expect(schemas.room)
            .to.have.property('default-room')
            .that.is.an('object');

        expect(schemas.building.kindergarden)
            .to.have.property('baserecord')
            .that.is.an('object');
        expect(schemas.building.kindergarden)
            .to.have.property('state')
            .that.is.an('object');
        
        expect(schemas.building.school)
            .to.have.property('baserecord')
            .that.is.an('object');
        expect(schemas.building.school)
            .to.have.property('state')
            .that.is.an('object');
    
        expect(schemas.room['default-room'])
            .to.have.property('baserecord')
            .that.is.an('object');
        expect(schemas.room['default-room'])
            .to.have.property('state')
            .that.is.an('object');
        
        expect(schemas.gps)
            .to.have.property('baserecord')
            .that.is.an('object');
        expect(schemas.gps)
            .to.have.property('state')
            .that.is.an('object');
    
    });
})
