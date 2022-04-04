import React, { useState, useCallback } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import enums from '@mpieva/psydb-schema-enums';

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
    var send = useSend((formData) => ({
        type: 'experiment/change-participation-status',
        payload: {
            experimentId: experimentId,
            subjectId: subjectId,
            ...formData
        }
    }), { onSuccessfulUpdate });

    var options = (
        experimentType === 'away-team'
        ? {
            ...enums.awayTeamParticipationStatus.mapping,
            ...enums.awayTeamUnparticipationStatus.mapping,
        }
        : {
            ...enums.inviteParticipationStatus.mapping,
            ...enums.inviteUnparticipationStatus.mapping,
        }
    )

    var initialValues = {
        participationStatus: 'participated',
        excludeFromMoreExperimentsInStudy: false,
    };
    return (
        <DefaultForm onSubmit={ send.exec }initialValues={ initialValues }>
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
                                    label='Letzter Termin?'
                                />
                            </InputGroup.Text>
                        </InputGroup.Append>
                    )}
                    <InputGroup.Append>
                        <Button type='submit'>
                            Speichern
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            )}
        </DefaultForm>
    )
}

export default PostprocessSubjectForm;
