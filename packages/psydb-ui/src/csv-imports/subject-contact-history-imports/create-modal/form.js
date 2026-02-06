import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import * as HelperControls from './helper-controls';
import switchVariant from './switch-variant';

const SubjectContactHistoryImportCreateForm = (ps) => {
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var [{ translate }] = useI18N();
    var [ stage, setStage ] = useState(
        //'prepare'
        'preview'
    );

    var [ subjectType, setSubjectType ] = useState(
        'child'
    );
    
    var helperBag = { subjectType, setSubjectType }
    return (
        <>
            { stage === 'prepare' && (
                <HelperControlsContainer { ...helperBag } />
            )}
            { subjectType && (
                <CSVImporterFormSwitch
                    subjectType={ subjectType }
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

    var CSVImporterForm = switchVariant({ type: 'default' });
    return (
        <CSVImporterForm { ...pass }/>
    )
}

const HelperControlsContainer = (ps) => {
    var { subjectType, setSubjectType } = ps;
    
    var [{ translate }] = useI18N();

    return (
        <>
            <HelperControls.SubjectTypeSelect
                label={ translate('Subject Type') }
                value={ subjectType }
                onChange={ setSubjectType }
            />
            <hr />
        </>
    )
}


export default SubjectContactHistoryImportCreateForm;
