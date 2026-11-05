import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Form, InputGroup, AsyncButton } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields, withField } from '../formik';

const Select = withField({
    Control: Fields.GenericEnum.Control,
    DefaultWrapper: 'NoneWrapper'
});

const PostprocessSubjectForm = (ps) => {
    var {
        experimentType,
        experimentId,
        subjectId,
        enableFollowUpExperiments,
        enableForm = true,
        onSuccessfulUpdate
    } = ps;

    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'experiment/change-participation-status',
        payload: {
            experimentId: experimentId,
            subjectId: subjectId,
            ...formData
        }
    }), { onSuccessfulUpdate });

    var options = Object.keys(
        experimentType === 'away-team'
        ? {
            ...enums.awayTeamParticipationStatus.mapping,
            ...enums.awayTeamUnparticipationStatus.mapping,
        }
        : {
            ...enums.inviteParticipationStatus.mapping,
            ...enums.inviteUnparticipationStatus.mapping,
        }
    ).reduce((acc, key) => ({
        ...acc, [key]: translate('_participationStatus_' + key)
    }), {})

    var initialValues = {
        participationStatus: 'participated',
        excludeFromMoreExperimentsInStudy: false,
    };
    return (
        <DefaultForm
            onSubmit={ enableForm ? send.exec : () => {}}
            initialValues={ initialValues }
        >
            {({ isSubmitting }) => (
                <InputGroup>
                    <Select
                        dataXPath='$.participationStatus'
                        options={ options }
                        disabled={ !enableForm }
                    />
                    { enableFollowUpExperiments && (
                        <InputGroup.Append>
                            <InputGroup.Text>
                                <Fields.PlainCheckbox
                                    dataXPath='$.excludeFromMoreExperimentsInStudy'
                                    label={ translate('Last Appointment?') }
                                    disabled={ !enableForm }
                                />
                            </InputGroup.Text>
                        </InputGroup.Append>
                    )}
                    <InputGroup.Append>
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isSubmitting }
                            disabled={ !enableForm }
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </InputGroup.Append>
                </InputGroup>
            )}
        </DefaultForm>
    )
}

export default PostprocessSubjectForm;
