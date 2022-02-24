import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { Pair } from '@mpieva/psydb-ui-layout';
import { withRecordEditor, FormBox } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        renderFormBox = true,
        onSuccessfulUpdate
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        subChannels: ['gdpr', 'scientific'],
        onSuccessfulUpdate
    });

    var initialValues = only({
        from: {
            gdpr: record.gdpr.state,
            scientific: record.scientific.state,
        },
        paths: [
            'gdpr.custom',
            'scientific.custom',
            'scientific.testingPermissions',
            'scientific.systemPermissions',
            'scientific.comment',
        ]
    });

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
            { onlineId && (
                <Pair 
                    label='Online ID Code'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { onlineId }
                </Pair>
            )}
            { (sequenceNumber || onlineId) && (
                <hr />
            )}
            <MainForm.Component
                title='Proband bearbeiten'
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
                renderFormBox={ false }
            />
        </>
    );

    var renderedForm = (
        renderFormBox
        ? (
            <FormBox title='Proband bearbeiten'>
                { renderedContent }
            </FormBox>
        )
        : renderedContent
    );

    return (
        <>
            { renderedForm }
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

