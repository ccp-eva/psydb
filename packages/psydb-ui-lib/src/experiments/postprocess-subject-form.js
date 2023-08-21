import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import enums from '@mpieva/psydb-schema-enums';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
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
        ...acc, [key]: translate(key)
    }), {})

    var initialValues = {
        participationStatus: 'participated',
        excludeFromMoreExperimentsInStudy: false,
    };
    return (
        <DefaultForm
            onSubmit={ send.exec }
            initialValues={ initialValues }
        >
            {(formikProps) => (
                <InputGroup>
                    <Select
                        dataXPath='$.participationStatus'
                        options={ options }
                    />
                    { enableFollowUpExperiments && (
                        <InputGroup.Append>
                            <InputGroup.Text>
                                <Fields.PlainCheckbox
                                    dataXPath='$.excludeFromMoreExperimentsInStudy'
                                    label={ translate('Last Appointment?') }
                                />
                            </InputGroup.Text>
                        </InputGroup.Append>
                    )}
                    <InputGroup.Append>
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            )}
        </DefaultForm>
    )
}

export default PostprocessSubjectForm;
