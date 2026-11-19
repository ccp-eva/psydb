'use strict';
module.exports = {
    ...require('./read'), // XXX: stub
    ...require('./read-many'),
    ...require('./subject-type-infos'),
    ...require('./available-subject-crts'),
    ...require('./enabled-subject-crts'),
    ...require('./enabled-csv-importers'),

    list: require('./list'),
    readManyLabels: require('./read-many-labels'),
    relatedStudyConsentForms: require('./related-study-consent-forms'),
}
