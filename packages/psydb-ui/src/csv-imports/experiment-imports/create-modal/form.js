import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetchAll, useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import { RecordPicker } from '@mpieva/psydb-ui-lib';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import { switchComponent } from './specific-importer-form-sections';
import * as HelperControls from './helper-controls';

const ExperimentImportCreateForm = (ps) => {
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate',
        'onFailedUpdate'
    ]});

    var translate = useUITranslation();
    var [ studyType, setStudyType ] = useState('wkprc_study');
    var [ studyRecord, setStudyRecord ] = useState({ _id: '6566b5c26c830cb226c1389b' });
    var [ subjectType, setSubjectType ] = useState('');
    var [ csvImporter, setCSVImporter ] = useState();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        studyCRTs: agent.fetchAvailableCRTs({ collections: [ 'study' ]}),
    }), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { studyCRTs } = fetched._stageDatas;
    
    var showStudyTypeSelect = true;
    if (studyCRTs.length === 1) {
        showStudyTypeSelect = false;
        studyType = studyCRTs[0].getType()
    }

    return (
        <>
            { showStudyTypeSelect && (
                <HelperControls.StudyTypeSelect
                    label={ translate('Study Type') }
                    value={ studyType }
                    onChange={ setStudyType }
                />
            )}
            { studyType && (
                <HelperControls.StudyRecordPicker
                    label={ translate('Study') }
                    value={ studyRecord }
                    onChange={ setStudyRecord }
                    studyType={ studyType }
                />
            )}
            { studyRecord && (
                <HelperControls.StudySubjectTypeSelect
                    label={ translate('Subject Type') }
                    value={ subjectType }
                    onChange={ setSubjectType }
                    studyId={ studyRecord._id }
                />
            )}
            { subjectType && (
                <HelperControls.StudyCSVImporterSelect
                    label={ translate('Import Type') }
                    value={ csvImporter }
                    onChange={ setCSVImporter }
                    studyId={ studyRecord._id }
                    subjectType={ subjectType }
                    importType='experiment'
                />
            )}
            { csvImporter && (
                <CSVImporterFormSwitch
                    studyId={ studyRecord._id }
                    subjectType={ subjectType }
                    csvImporter={ csvImporter }
                />
            )}
        </>
    )
}

const CSVImporterFormSwitch = (ps) => {
    var { csvImporter } = ps;
    
    var pass = only({ from: ps, keys: [
        'studyId', 'subjectType'
    ]});

    var CSVImporterForm = switchComponent(csvImporter);
    return (
        <>
            <hr />
            <CSVImporterForm { ...pass }/>
        </>
    )
}


export default ExperimentImportCreateForm;
