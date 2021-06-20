import React, { useCallback, useMemo } from 'react';
import jsonpointer from 'jsonpointer';

import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import agent from '@mpieva/psydb-ui-request-agents';
import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';

import SubjectTypeContainer from './subject-type-container';

import CommentModal from '@mpieva/psydb-ui-lib/src/per-subject-comment-modal';
import MoveModal from '@mpieva/psydb-ui-lib/src/move-subject-modal';
import RemoveModal from '@mpieva/psydb-ui-lib/src/remove-subject-modal';


const Subjects = ({
    experimentData,
    studyData,
    subjectDataByType,
    onSuccessfulUpdate,
}) => {
    var { selectionSettingsBySubjectType } = studyData.record.state;
    var stringifyStudyValue = createStringifier(studyData);

    var commentModal = useModalReducer({ show: false });
    var moveModal = useModalReducer({ show: false });
    var removeModal = useModalReducer({ show: false });

    var changeStatusThunk = (status) => ({ subjectId }) => {
        var message = {
            type: 'experiment/change-invitation-status',
            payload: {
                experimentId: experimentData.record._id,
                subjectId: subjectId,
                invitationStatus: status
            }
        }

        agent.send({ message })
        .then(response => {
            onSuccessfulUpdate && onSuccessfulUpdate({ response });
        })
    };
    
    var onClickConfirm = changeStatusThunk('confirmed');
    var onClickMailbox = changeStatusThunk('mailbox');
    var onClickContactFailed = changeStatusThunk('contact-failed');

    return (
        <>
            <CommentModal { ...({
                show: commentModal.show,
                onHide: commentModal.handleHide,
                payloadData: commentModal.data,

                experimentData,

                onSuccessfulUpdate,
            }) } />

            <MoveModal { ...({
                show: moveModal.show,
                onHide: moveModal.handleHide,
                payloadData: moveModal.data,

                experimentData,
                studyData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />

            <RemoveModal { ...({
                show: removeModal.show,
                onHide: removeModal.handleHide,
                payloadData: removeModal.data,

                experimentData,
                subjectDataByType,

                onSuccessfulUpdate,
            }) } />

            <div className='p-3'>
                { selectionSettingsBySubjectType.map((it, index) => {
                    var {
                        subjectRecordType,
                        subjectsPerExperiment
                    } = it;
                    
                    var subjectTypeLabel = stringifyStudyValue({
                        ptr: `/state/selectionSettingsBySubjectType/${index}/subjectRecordType`,
                        collection: 'subject',
                        type: 'CustomRecordTypeKey',
                    });

                    var fullSubjectData = subjectDataByType[subjectRecordType];
                    if (fullSubjectData.records.length < 1) {
                        return null;
                    }
                    
                    return (
                        <SubjectTypeContainer { ...({
                            key: subjectRecordType,
                            
                            subjectTypeKey: subjectRecordType,
                            subjectTypeLabel,
                            subjectsPerExperiment,

                            experimentData,
                            fullSubjectData,

                            onClickComment: commentModal.handleShow,
                            onClickMove: moveModal.handleShow,
                            onClickRemove: removeModal.handleShow,

                            onClickConfirm,
                            onClickMailbox,
                            onClickContactFailed,
                        })} />
                    );
                })}
            </div>
        </>
    )
}

/*var createModalReducer = (tag) => (state, action) => {
    var { type, payload } = action;
    
    var showProp = `show${ucfirst(tag)}`,
        dataProp = `${tag}Data`;

    var showType = `show-${tag}`,
        hideType = `hide-${tag}`;

    switch (type) {
        case showType:
            return {
                ...state,
                [showProp]: true,
                [dataProp]: {
                    ...payload
                }
            }
        case hideType:
            return {
                ...state,
                [showProp]: false,
            }
}

var commentReducer = createModalReducer('comment');
var moveReducer = createModalReducer('move');
var removeReducer = createModalReducer('remove')

var reducer = (state, action) => {
    var subStates = [
        commentReducer(state, action),
        moveReducer(state, action),
        removeReducer(state, action),
    ];

    if (subStates.findIndex(it => it === undefined) !== -1) {
        return undefined;
    }

    return subStates.reduce((acc, it) => ({
        ...acc, ...it
    }), {});
}

var ucfirst = ([ initial, ...rest ]) => (
    [ initial.toUpperCase(), ...rest ].join('')
);*/

export default Subjects;
