import React from 'react';

import {
    format as formatDateInterval
} from '@mpieva/psydb-date-interval-fns';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    Container,
    Pair,
    Button,
    TeamLabel
} from '@mpieva/psydb-ui-layout';

import datefns from '../../date-fns';
import { DefaultForm, Fields } from '../../formik';

const FormContainer = (ps) => {
    var {
        onHide,
        
        experimentData,
        teamData,
        studyData,
       
        nextExperimentRecord,

        nextReservationRecord,
        nextTeamRecord,
        nextInterval,

        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var locale = useUILocale();

    var now = new Date();
    var { enableFollowUpExperiments } = studyData.record.state;
    var {
        _id: experimentId,
        state: { isPostprocessed }
    } = experimentData.record;
    
    var send = undefined;
    var isPlaceholder = false;

    if (nextExperimentRecord) {
        isPlaceholder = nextExperimentRecord.state.subjectData.length < 1;
        nextInterval = nextExperimentRecord.state.interval;

        if (isPlaceholder) {
            send = useSend((formData) => ({
                type: 'experiment/followup-awayteam-move-to-placeholder',
                payload: {
                    sourceExperimentId: experimentData.record._id,
                    targetExperimentId: nextExperimentRecord._id,
                }
            }), { onSuccessfulUpdate })
        }
        else {
            // TODO: but this should never happen though
        }
    }
    else {
        send = useSend((formData) => ({
            type: 'experiment/create-followup-awayteam',
            payload: {
                sourceExperimentId: experimentData.record._id,
                subjectOp: formData.subjectOp,
                targetExperimentOperatorTeamId: nextTeamRecord._id,
                targetInterval: nextInterval,
            }
        }), { onSuccessfulUpdate })
    }

    var formatOptions = { dateFormat: 'cccc P', locale };
    var formattedNow = formatDateInterval(
        experimentData.record.state.interval, formatOptions
    );
    var formattedNext = formatDateInterval(
        nextInterval, formatOptions
    );

    return (
        <div>
            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label={ translate('Date') }>
                        { formattedNow.startDate }
                    </Pair>
                    <Pair label='Team'>
                        <TeamLabel { ...teamData.record.state } />
                    </Pair>
                </Container>
            </div>

            <header className='pb-1 mt-3'><b>
                { translate('Follow-Up Appointment') }
            </b></header>
            <DefaultForm 
                initialValues={{ subjectOp: 'none' }}
                onSubmit={ send.exec }
            >
                {(formikProps) => (
                    <>
                        <div className='p-2 bg-white border'>
                            <Container>
                                <Pair label={ translate('Date') }>
                                    { formattedNext.startDate }
                                </Pair>
                                <Pair label={ translate('Team') }>
                                    <TeamLabel { ...nextTeamRecord.state } />
                                </Pair>
                                { !nextExperimentRecord && (
                                    <SubjectOpField { ...({
                                        isPostprocessed,
                                        enableFollowUpExperiments
                                    })} />
                                )}
                            </Container>
                        </div>
                        <div className='d-flex justify-content-end mt-3'>
                            <Button type='submit'>
                                { translate('Save') }
                            </Button>
                        </div>
                    </>
                )}
            </DefaultForm>
        </div>
    )

}

var SubjectOpField = (ps) => {
    var {
        isPostprocessed,
        enableFollowUpExperiments
    } = ps;

    var translate = useUITranslation();

    return (
        <Fields.GenericEnum
            dataXPath='$.subjectOp'
            uiSplit={[ 4, 8 ]}
            labelClassName='px-0'
            label={ translate('Subjects') }
            options={{
                'none': translate('_followUpExpSubjectOp_none'),
                'move-unprocessed': translate('_followUpExpSubjectOp_move-unprocessed'), 
                ...( isPostprocessed && enableFollowUpExperiments && {
                    'copy': translate('_followUpExpSubjectOp_copy'),
                }),
            }}
        />
    )
}


const AwayTeamConfirmModalBody = (ps) => {
    var {
        onHide,

        experimentData,
        teamData,
        studyData,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var {
        experimentRecord: nextExperimentRecord,
        reservationRecord: nextReservationRecord,
        teamRecord: nextTeamRecord,
        interval: nextInterval,
    } = modalPayloadData;

    return (
        <>
            <FormContainer { ...({
                experimentData,
                teamData,
                studyData,

                nextExperimentRecord,
                nextReservationRecord,
                nextTeamRecord,
                nextInterval,

                onSuccessfulUpdate: demuxed([
                    onHide, onSuccessfulUpdate
                ]),
            }) } />
        </>
    )
}

const AwayTeamConfirmModal = WithDefaultModal({
    Body: AwayTeamConfirmModalBody,
    title: 'Follow-Up Appointment',
    size: 'md',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-light'
});

export default AwayTeamConfirmModal;
