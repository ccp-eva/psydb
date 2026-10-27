import React from 'react';
import { useParams } from 'react-router';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, FormBox } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

const RecordEditor = (ps) => {
    var { onSuccessfulUpdate } = ps;
    var { id: studyEmailMetaTemplateId } = useParams();
    var [{ translate }] = useI18N();

    var send = useSend((formData) => ({
        type: 'study-email-meta-template/patch',
        payload: { _id: studyEmailMetaTemplateId, props: formData }
    }), { onSuccessfulUpdate: () => onSuccessfulUpdate() });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyEmailMetaTemplate.read({ studyEmailMetaTemplateId })
    ), [ studyEmailMetaTemplateId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    
    return (
        <FormBox title={ translate('Edit Email Meta Template') }>
            <MainForm.Component
                initialValues={ { mailText: '', ...record.state } }
                related={ related }
                onSubmit={ send.exec }
            />
        </FormBox>
    );
}

export default RecordEditor;
