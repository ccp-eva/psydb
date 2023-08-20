import React, { createContext, useContext } from 'react';

import {
    useSend,
    useModalReducer,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import {
    SubjectIconButton,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import { ExperimentSubjectDropdown } from '@mpieva/psydb-ui-lib';

import SubjectsContainer from '../../subjects-container';
import Modals from './modals';

const ActionsContext = createContext({});

const Subjects = (ps) => {
    var {
        experimentData,
        labProcedureSettingData,
        studyData,
        subjectDataByType,
        onSuccessfulUpdate,
    } = ps;
    var { type: experimentType } = experimentData.record;

    var commentModal = useModalReducer({ show: false });
    var moveModal = useModalReducer({ show: false });
    var followupModal = useModalReducer({ show: false });
    var removeModal = useModalReducer({ show: false });
    var removeManualModal = useModalReducer({ show: false });

    var send = useSend(({ subjectId, status }) => ({
        type: 'experiment/change-invitation-status',
        payload: {
            experimentId: experimentData.record._id,
            subjectId: subjectId,
            invitationStatus: status
        }
    }), { onSuccessfulUpdate });

    var wrap = (status) => ({ subjectId }) => (
        send.exec({ subjectId, status })
    )

    var onClickConfirm = wrap('confirmed');
    var onClickMailbox = wrap('mailbox');
    var onClickContactFailed = wrap('contact-failed');

    return (
        <>
            <Modals { ...({
                experimentData,
                studyData,
                subjectDataByType,

                commentModal,
                moveModal,
                followupModal,
                removeModal,
                removeManualModal,

                onSuccessfulUpdate,
            }) } />
            
            <ActionsContext.Provider value={{
                experimentType,

                onClickComment: commentModal.handleShow,
                onClickMove: moveModal.handleShow,
                onClickFollowUp: (
                    studyData.record.state.enableFollowUpExperiments
                    ? followupModal.handleShow
                    : undefined
                ),
                onClickRemove: removeModal.handleShow,
                onClickRemoveManual: removeManualModal.handleShow,

                onClickConfirm,
                onClickMailbox,
                onClickContactFailed,
            }}>
                <SubjectsContainer { ...({
                    className: 'p-3 media-print-no-spacing-x',
                    experimentData,
                    labProcedureSettingData,
                    studyData,
                    subjectDataByType,
                    
                    ActionsComponent,
                }) } />
            </ActionsContext.Provider>
        </>
    )
}

const ActionsComponent = ({
    experimentSubjectData,
    subjectRecord,

    hasContactIssue,
    isUnparticipated,
}) => {
    var context = useContext(ActionsContext);
    var permissions = usePermissions();

    var {
        experimentType,

        onClickComment,
        onClickMove,
        onClickFollowUp,
        onClickRemove,
        onClickRemoveManual,

        onClickConfirm,
        onClickMailbox,
        onClickContactFailed,
    } = context;

    var canRemoveSubject = permissions.hasLabOperationFlag(
        experimentType, 'canRemoveExperimentSubject'
    );

    return (
        <div className='d-flex justify-content-end media-print-hidden'>
            { permissions.hasFlag('canReadSubjects') && (
                <SubjectIconButton
                    to={`/subjects/${subjectRecord.type}/${subjectRecord._id}`}
                />
            )}

            { experimentType !== 'away-team' && (
                <ExperimentSubjectDropdown { ...({
                    subjectRecord,
                    
                    onClickComment,
                    onClickMove,
                    onClickFollowUp,
                    onClickRemove,

                    onClickConfirm,
                    onClickMailbox,
                    onClickContactFailed,
                        
                    disabled: isUnparticipated,
                    experimentType,
                    enableSubjectDetailsLink: false,
                }) } />
            )}
            
            { canRemoveSubject && (
                <RemoveIconButtonInline
                    onClick={ () => {
                        return onClickRemoveManual({
                            subjectRecord,
                        })
                    }}
                />
            )}
        </div>
    )
}


export default Subjects;
