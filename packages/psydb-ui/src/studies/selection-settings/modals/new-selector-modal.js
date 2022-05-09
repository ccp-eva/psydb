import React from 'react';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const Form = (ps) => {
    var { onSubmit, subjectTypeMap } = ps;

    return (
        <DefaultForm
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix={ '/payload' }
        >
            {(formikProps) => (
                <>
                    <Fields.GenericEnum
                        label='Proband:innentyp'
                        dataXPath='$.subjectTypeKey'
                        options={ subjectTypeMap }
                    />
                    <Button type='submit'>Speichern</Button>
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
    title: 'Proband:innentyp hinzufügen',
    size: 'lg',

    Body: NewSelectorModalBody
});

export default NewSelectorModal;
