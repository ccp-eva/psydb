import React from 'react';

const PostprocessForm = (ps) => {
    var {
        experimentId, subjectId,
        enableFollowUpExperiments = false,
        onSuccessfulUpdate, onFailedUpdate,
    } = ps;

    var send = useSend((formData) => ({
        type: 'experiment/change-participation-status',
        payload: { experimentId, subjectId, ...formData }
    }), { onSuccessfulUpdate });

    var [ didFetch, fetched] = useFetch((agent) => {
        return agent.studyConsentDoc.readByExperimentAndSubject({
            experimentId, subjectId,
        })
    }, [ experimentId, subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record: studyConsentDoc, subjectCRT } = fetched.data;
    var fieldsBag = {
        subjectId, subjectCRT, studyConsentDoc,
        enableFollowUpExperiments
    };
    return (
        <DefaultForm
            onSubmit={ send.exec }
            initialValues={ initialValues }
        >
            {() => (
                <FormFields />
            )}
        </DefaultForm>
    )
}
