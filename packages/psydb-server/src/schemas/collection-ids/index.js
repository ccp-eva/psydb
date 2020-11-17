'use strict';
var derive = require('./derive-helper'),
    BaseId = require('../primitives/mongo-oid.schema.js').ref;

module.exports = {
    SubjectScientificId: derive(BaseId, 'psy-db/subject-scientific-id'),
    SubjectGDPRId: derive(BaseId, 'psy-db/subject-gdpr-id'),

    PersonnelScientificId: derive(BaseId, 'psy-db/personnel-scientific-id'),
    PersonnelGDPRId: derive(BaseId, 'psy-db/personnel-gdpr-id'),

    ExternalPeopleScientificId: derive(BaseId, 'psy-db/external-people-scientific-id'),
    ExternalPeopleGDPRId: derive(BaseId, 'psy-db/external-people-gdpr-id'),

    InstitutionId: derive(BaseId, 'psy-db/institution-id'),
    StudyId: derive(BaseId, 'psy-db/study-id'),
    ExperimentId: derive(BaseId, 'psy-db/experiment-id'),
    LocationId: derive(BaseId, 'psy-db/location-id'),
}
