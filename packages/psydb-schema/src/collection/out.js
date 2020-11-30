'use strict';
var out = {
    subject: {
        canHaveGdprPortion: true,
        fixedTypes: {
            animal: {
                hasCustomSubtypes: true,
                subtypes: {
                    // collection record
                    dog: {
                        scientific: SubjectScientificSchema({
                            type: 'animal',
                            subtype: 'dog',
                            custom: doc.innerScientific
                        }), // => { state, record }
                        gdpr: AnimalGdprSchema(doc.innerGdpr),
                    },
                    // collection record
                    cat: {
                        scientific: SCHEMA
                    }
                }
            },
            human: {
                hasCustomSubtypes: true,
                subtypes: {
                    // collection record
                    child: {
                        scientific: SCHEMA,
                        gdpr: SCHEMA,
                    } 
                }
            },
        },
    },
    location: {
        canHaveGdprPortion: false,
        hasCustomTypes: true,
        fixedTypes: {
            building: { hasCustomSubtypes: true },
            room: { hasCustomSubtypes: true },
        },
    },
    personnel: {
        canHaveGdprPortion: true,
        hasCustomTypes: true
    },
    study: {
        canHaveGdprPortion: false,
        hasCustomTypes: false
    }
}
