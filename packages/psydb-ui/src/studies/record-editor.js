import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { Pair } from '@mpieva/psydb-ui-layout';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;
    
    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });
    
    var defaults = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });
    
    var initialValues = only({
        from: record.state,
        paths: [
            'name',
            'shorthand',
            'runningPeriod',
            'enableFollowUpExperiments',
            'researchGroupIds',
            'scientistIds',
            'studyTopicIds',

            'custom',
            'systemPermissions',
        ]
    });

    // FIXME: use deep merge
    initialValues = {
        ...defaults,
        ...initialValues,
        custom: {
            ...defaults.custom,
            ...initialValues.custom
        }
    }

    var {
        sequenceNumber,
        onlineId
    } = record;

    var renderedContent = (
        <>
            { sequenceNumber && (
                <Pair 
                    label='ID Nr.'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { sequenceNumber }
                </Pair>
            )}
            { sequenceNumber && (
                <hr />
            )}
            <MainForm.Component
                title='Studie bearbeiten'
                crtSettings={ crtSettings }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
                renderFormBox={ false }
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

export default RecordEditor;
