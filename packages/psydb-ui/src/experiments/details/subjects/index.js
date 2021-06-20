import React, { useCallback } from 'react';
import jsonpointer from 'jsonpointer';

import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import SubjectTypeContainer from './subject-type-container';

import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';

import CommentModal from '../per-subject-comment-modal';
import MoveModal from '../move-subject-modal';
import RemoveModal from '../remove-subject-modal';

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
