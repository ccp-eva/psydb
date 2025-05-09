import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const EditForm = (ps) => {
    var {
        collection,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record, related } = fetched;
    var translate = useUITranslation();

    var send = useSendPatch({
        collection,
        record,
        onSuccessfulUpdate
    });
    
    var wrappedSend = (formData, formikBag) => {
        var { props } = formData;
        return send.exec(props, formikBag)
    }

    var initialValues = {
        props: only({
            from: record.state,
            paths: [
                'name',
                'locationType',
                'locationId',
                'comment',
                'systemPermissions'
            ]
        })
    };

    var { subjectType } = record;

    return (
        <>
            <MainForm.Component
                title={ translate('Edit Subject Group') }
                initialValues={ initialValues }
                onSubmit={ wrappedSend }
                subjectType={ subjectType }
                related={ related }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
    shouldFetchCRTSettings: false
});

