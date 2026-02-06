'use strict';
var endpoints_SPLIT = require('@mpieva/psydb-api-endpoints');
var { withPostStages, withGetStages } = require('./stage-helpers');

var addCSVImportRoutes = (bag) => {
    var { router } = bag;

    // XXX: is that still used??
    router.post(
        '/csv-import/preview/wkprc-apestudies-default',
        ...withPostStages({ endpoint: endpoints_SPLIT.csvImport.preview })
    );

    addExperimentImportRoutes({ router });
    addSubjectImportRoutes({ router });
    addSubjectContactHistoryImportRoutes({ router });
}

var addExperimentImportRoutes = (bag) => {
    var { router } = bag;
    
    var {
        search, read, relatedExperiments, preview
    } = endpoints_SPLIT.csvImport.experiment;
    
    router.post(
        '/csv-import/experiment/search',
        ...withPostStages({ endpoint: search })
    );
    router.post(
        '/csv-import/experiment/read',
        ...withPostStages({ endpoint: read })
    );
    router.post(
        '/csv-import/experiment/related-experiments',
        ...withPostStages({ endpoint: relatedExperiments })
    );
    router.post(
        '/csv-import/experiment/preview/wkprc-apestudies-default',
        ...withPostStages({ endpoint: preview['wkprc-apestudies-default'] })
    );
    router.post(
        '/csv-import/experiment/preview/manual-only-participation',
        ...withPostStages({ endpoint: preview['manual-only-participation'] })
    );
    router.post(
        '/csv-import/experiment/preview/online-survey',
        ...withPostStages({ endpoint: preview['online-survey'] })
    );
}

var addSubjectImportRoutes = (bag) => {
    var { router } = bag;
   
    var {
        search, read, relatedSubjects, preview
    } = endpoints_SPLIT.csvImport.subject;

    router.post(
        '/csv-import/subject/search',
        ...withPostStages({ endpoint: search })
    );
    router.post(
        '/csv-import/subject/read',
        ...withPostStages({ endpoint: read })
    );
    router.post(
        '/csv-import/subject/related-subjects',
        ...withPostStages({ endpoint: relatedSubjects })
    );
    router.post(
        '/csv-import/subject/preview',
        ...withPostStages({ endpoint: preview })
    );
}

var addSubjectContactHistoryImportRoutes = (bag) => {
    var { router } = bag;
    
    var {
        search, read, relatedSubjectContactHistoryItems, preview
    } = endpoints_SPLIT.csvImport.subjectContactHistory;
    
    router.post(
        '/csv-import/subject-contact-history/search',
        ...withPostStages({ endpoint: search })
    );
    router.post(
        '/csv-import/subject-contact-history/read',
        ...withPostStages({ endpoint: read })
    );
    router.post(
        '/csv-import/subject-contact-history/related-subject-contact-history-items',
        ...withPostStages({ endpoint: relatedSubjectContactHistoryItems })
    );
    router.post(
        '/csv-import/subject-contact-history/preview/default',
        ...withPostStages({ endpoint: preview['default'] })
    );
}

module.exports = addCSVImportRoutes;
