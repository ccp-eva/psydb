import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetchAll, useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import { RecordPicker } from '@mpieva/psydb-ui-lib';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import { switchComponent } from './specific-importer-form-sections';
import * as HelperControls from './helper-controls';

const SubjectContactHistoryImportCreateForm = (ps) => {
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var [{ translate }] = useI18N();
    var [ stage, setStage ] = useState('prepare');

    var [ subjectType, setSubjectType ] = useState(
        //'child'
    );
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchAvailableCRTs({ collections: [ 'subject' ]}),
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    var subjectCRTs = fetched.data;
    var helperBag = { subjectCRTs, subjectType, setSubjectType }
    return (
        <>
            { stage === 'prepare' && (
                <HelperControlsContainer { ...helperBag } />
            )}
            { csvImporter && (
                <CSVImporterFormSwitch
                    subjectType={ subjectType }
                    csvImporter={ csvImporter }
                    stage={ stage }
                    setStage={ setStage }
                    { ...triggerBag }
                />
            )}
        </>
    )
}

const CSVImporterFormSwitch = (ps) => {
    var { csvImporter } = ps;
    
    var pass = only({ from: ps, keys: [
        'subjectType', 'stage', 'setStage',
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var CSVImporterForm = switchComponent(csvImporter);
    return (
        <CSVImporterForm { ...pass }/>
    )
}

const HelperControlsContainer = (ps) => {
    var { subjectType, setSubjectType } = ps;
    
    var [{ translate }] = useI18N();

    return (
        <>
            <HelperControls.RecordTypeSelect
                label={ translate('Subject Type') }
                crts={ subjectCRTs }
                value={ subjectType }
                onChange={ setSubjectType }
            />
            <hr />
        </>
    )
}


export default SubjectContactHistoryImportCreateForm;
