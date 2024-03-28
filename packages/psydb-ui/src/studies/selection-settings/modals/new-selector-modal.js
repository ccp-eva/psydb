import React from 'react';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    AsyncButton,
    SmallFormFooter
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';


const Form = (ps) => {
    var { onSubmit, isTransmitting, subjectCRTs } = ps;

    var [ language ] = useUILanguage();
    var translate = useUITranslation();

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
                        options={ subjectCRTs.asOptions({ language }) }
                    />
                    <SmallFormFooter extraClassName='pt-2'>
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isTransmitting }
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </SmallFormFooter>
                </>
            )}
        </DefaultForm>
    )
}

const NewSelectorModalBody = (ps) => {
    var {
        studyId,
        availableSubjectCRTs,
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
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });
    
    var remainingSubjectCRTs = availableSubjectCRTs.filter({
        type: { $nin: existingSubjectTypes }
    });

    return (
        <Form
            { ...send.passthrough }
            subjectCRTs={ remainingSubjectCRTs }
        />
    );
}

const NewSelectorModal = WithDefaultModal({
    title: 'Add Subject Type',
    size: 'lg',

    Body: NewSelectorModalBody
});

export default NewSelectorModal;
