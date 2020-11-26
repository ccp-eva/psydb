'use strict';
var expect = require('chai').expect,
    inspect = require('./helpers/inspect'),
    custom = require('./fixtures/custom-subject-scientifics/'),
    createSchemas = (
        require('../src/collection/subject-gdpr/create-all-schemas')
    );

describe('createSubjectGdprSchemas()', () => {
    it('generates full schema structure based on custom schemas', () => {
        var schemas = createSchemas({
            customAnimalGdprItems: [
                {
                    key: 'chimpanzee',
                    schema: custom.animal.chimpanzee,
                },
                {
                    key: 'bonobo',
                    schema: custom.animal.bonobo
                }
            ],
            customHumanGdprItems: [
                {
                    key: 'child',
                    schema: custom.human.child,
                },
                {
                    key: 'teacher',
                    schema: custom.human.teacher,
                }
            ]
        });

        //inspect(schemas);

        expect(schemas)
            .to.have.property('animal')
            .that.is.an('object');
        expect(schemas)
            .to.have.property('human')
            .that.is.an('object');
        
        expect(schemas.animal)
            .to.have.property('chimpanzee')
            .that.is.an('object');
        expect(schemas.animal)
            .to.have.property('bonobo')
            .that.is.an('object');
        expect(schemas.human)
            .to.have.property('child')
            .that.is.an('object');
        expect(schemas.human)
            .to.have.property('teacher')
            .that.is.an('object');

        expect(schemas.animal.chimpanzee)
            .to.have.property('state')
            .that.is.an('object');
        
        expect(schemas.animal.bonobo)
            .to.have.property('state')
            .that.is.an('object');
        
        expect(schemas.human.child)
            .to.have.property('state')
            .that.is.an('object');
        
        expect(schemas.human.teacher)
            .to.have.property('state')
            .that.is.an('object');
        
    });
})
