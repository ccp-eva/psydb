import React from 'react';
import {
    useUITranslation,
    useUILanguage,
    useUILocale,
} from '@mpieva/psydb-ui-contexts';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { ExperimentSubjectDropdown } from '@mpieva/psydb-ui-lib';

import {
    MoveSubjectModal,
    FollowUpSubjectModal,
    RemoveSubjectModal,
    PerSubjectCommentModal,
} from '@mpieva/psydb-ui-lib/src/modals';

import { Subject } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';


const SubjectItem = (ps) => {
    var {
        subjectDataItem,
        experimentOperatorTeamRecords,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        phoneField,
        studyRecord,
        
        experimentRecord,

        onChangeStatus,
        onSuccessfulUpdate
    } = ps;

    var {
        subjectId,
        invitationStatus,
        comment,
    } = subjectDataItem;

    var subjectRecord = subjectRecordsById[subjectId];

    var [ language ] = useUILanguage();
    var locale = useUILocale();
    var translate = useUITranslation();

    var commentPerSubjectModal = useModalReducer();
    var moveSubjectModal = useModalReducer();
    var followUpSubjectModal = useModalReducer();
    var removeSubjectModal = useModalReducer();

    var sharedModalBag = {
        shouldFetch: true,
        experimentId: experimentRecord._id,
        experimentType: experimentRecord.type,

        onSuccessfulUpdate
    };

    return (
        <div className='d-flex'>
            
            <PerSubjectCommentModal { ...({
                ...commentPerSubjectModal.passthrough,

                experimentData: { record: experimentRecord },
                onSuccessfulUpdate,
            }) } />

            <MoveSubjectModal { ...sharedModalBag } { ...({
                ...moveSubjectModal.passthrough,
            }) } />

            <FollowUpSubjectModal { ...sharedModalBag } { ...({
                ...followUpSubjectModal.passthrough,
            }) } />

            <RemoveSubjectModal { ...sharedModalBag } { ...({
                ...removeSubjectModal.passthrough,
                payloadData: removeSubjectModal.data, // FIXME
            }) } />

            <div className='flex-grow'>
                <Subject
                    value={ subjectRecord }
                    related={ subjectRelated }
                    theme={ Themes.HorizontalSplitDense }
                >
                    <Subject.DisplayOrdered
                        displayFields={ subjectDisplayFieldData }
                    />
                    { phoneField && (
                        <div className='mt-3 font-weight-bold'>
                            <Subject.DisplayOrdered
                                displayFields={[ phoneField ]}
                            />
                        </div>
                    )}
                </Subject>
                { comment && (
                    <div className='mt-3'>
                        <b><u>{ translate('Comment') }</u></b>
                        <div>
                            <i>{ comment }</i>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div>
                    <StatusButton
                        label={ translate('contact-failed_icon') }
                        buttonStatus='contact-failed'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label={ translate('mailbox_icon') }
                        buttonStatus='mailbox'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label={ translate('confirmed_icon') }
                        buttonStatus='confirmed'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                </div>
                <div className='d-flex justify-content-end mt-3'>
                    <ExperimentSubjectDropdown
                        subjectRecord={ subjectRecord }
                        experimentType={ experimentRecord.type }
                        variant='primary'
                        label={ translate('Functions') }

                        onClickComment={ commentPerSubjectModal.handleShow }
                        onClickMove={ moveSubjectModal.handleShow }
                        onClickFollowUp={
                            studyRecord.state.enableFollowUpExperiments
                            ? followUpSubjectModal.handleShow
                            : undefined
                        }
                        onClickRemove={ removeSubjectModal.handleShow }

                        enableStatusChanges={ false }
                    />
                </div>
            </div>
        </div>
    )
}

var StatusButton = (ps) => {
    var {
        label,
        buttonStatus,
        currentStatus,
        onClick
    } = ps;

    var variant = (
        buttonStatus === currentStatus
        ? 'primary'
        : 'outline-secondary'
    );
    return (
        <Button
            onClick={ () => onClick(buttonStatus) }
            variant={ variant }
            size='sm'
            className='ml-2'>
            <b
                className='d-inline-block'
                style={{ width: '23px' }}
            >
                { label }
            </b>
        </Button>
    );
}

export default SubjectItem;
