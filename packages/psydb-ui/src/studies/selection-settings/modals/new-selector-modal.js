import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    Button,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const Form = (ps) => {
    var { onSubmit, subjectTypeMap } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCustomRecordTypeMetadata({ only: [{
            collection: 'subject'
        }] })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.data;

    return (
        <DefaultForm
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix={ '/payload' }
        >
            {(formikProps) => (
                <>
                    <Fields.GenericEnum
                        label={ translate('Subject Type') }
                        dataXPath='$.subjectTypeKey'
                        options={ customRecordTypes.reduce((acc, it) => ({
                            ...acc,
                            [it.type]: translate.crt(it)
                        }), {}) }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    )
}

const NewSelectorModalBody = (ps) => {
    var {
        studyId,
        subjectTypeMap,
        existingSubjectTypes = [],

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var send = useSend((formData) => ({
        type: `subjectSelector/create`,
        payload: {
            subjectTypeKey: formData.subjectTypeKey,
            studyId,
            props: {
                isEnabled: true,
                generalConditions: [],
            }
        }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        <Form
            subjectTypeMap={
                Object.keys(subjectTypeMap).reduce((acc, key) => ({
                    ...acc,
                    ...(!existingSubjectTypes.includes(key) && {
                        [key]: subjectTypeMap[key].state.label
                    })
                }), {})
            }
            onSubmit={ send.exec }
        />
    );
}

const NewSelectorModal = WithDefaultModal({
    title: 'Add Subject Type',
    size: 'lg',

    Body: NewSelectorModalBody
});

export default NewSelectorModal;
