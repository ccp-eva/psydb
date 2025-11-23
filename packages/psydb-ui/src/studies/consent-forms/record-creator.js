import React, { useState } from 'react';

import {
    useFetch,
    useSendCreate,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const CRTSelectionWrapper = (ps) => {
    var { studyId } = ps;
    var [ subjectType, setSubjectType ] = useState();
    var [{ translate, language }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyAvailableSubjectCRTs({ studyId })
    ), [ studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { crts } = fetched.data;

    return (
        <div>
            <Controls.GenericEnum
                value={ subjectType }
                onChange={ setSubjectType }
                options={ crts.asOptions({ language }) }
            />
        </div>
    )
}

const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection, recordType
        })
    ), [ collection, recordType ])

    var send = useSendCreate({
        collection,
        recordType,
        onSuccessfulUpdate
    })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { fieldDefinitions } = fetched.data;
    var initialValues = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });

    var renderedContent = (
        <>
            <MainForm.Component
                title='Neue Studie'
                crtSettings={ fetched.data }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                permissions={ permissions }
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

export default CRTSelectionWrapper;
