import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { Pair, FormBox } from '@mpieva/psydb-ui-layout';
import { withRecordEditor } from '../lib';
import MainForm from './main-form';


const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        permissions,
        send,

        renderFormBox = true,
        renderVisibilityButton = false,
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var defaults = MainForm.createDefaults({
        fieldDefinitions,
        permissions
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

    // FIXME: use deep merge
    // FIXME: we might als need to update all
    // db records, we'll see
    initialValues.gdpr.custom = {
        ...defaults.gdpr.custom,
        ...initialValues.gdpr.custom
    };
    
    initialValues.scientific.custom = {
        ...defaults.scientific.custom,
        ...initialValues.scientific.custom
    };


    var {
        sequenceNumber,
        onlineId
    } = record;
    
    var isHidden = record.scientific.state.systemPermissions.isHidden;

    var renderedContent = (
        <div>
            { isHidden && (
                <>
                    <h5 className='text-muted'>
                        Datensatz ist Ausgeblendet
                    </h5>
                    <hr />
                </>
            )}
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
                title='Proband:in bearbeiten'
                crtSettings={ crtSettings }
                initialValues={ initialValues }
                onSubmit={ send.exec }

                record={ record }
                related={ related }
                permissions={ permissions }

                renderFormBox={ false }
                renderVisibilityButton={ renderVisibilityButton }
            />
            { isHidden && (
                <>
                    <hr />
                    <h5 className='text-muted'>
                        Datensatz ist Ausgeblendet
                    </h5>
                </>
            )}
        </div>
    );

    var renderedForm = (
        renderFormBox
        ? (
            <FormBox title='Proband:in bearbeiten'>
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
    Body: EditForm,
    collection: 'subject',
    subChannels: [ 'gdpr', 'scientific' ],
    shouldFetchSchema: false,
});
