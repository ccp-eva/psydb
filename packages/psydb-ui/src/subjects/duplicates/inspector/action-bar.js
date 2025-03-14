import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import {
    AsyncButton, Icons, WithDefaultModal,
    Button, SmallFormFooter
} from '@mpieva/psydb-ui-layout';

const ActionBar = (ps) => {
    var {
        subjectRecords,
        leftId,
        rightId,

        onSuccessfulMerge,
        onSuccessfulMark,
        onSuccessfulUnmark,
    } = ps;
    
    var [{ translate }] = useI18N();
    var mergeRightModal = useModalReducer();
    var mergeLeftModal = useModalReducer();

    var subjectsById = keyBy({ items: subjectRecords, byProp: '_id' });
    var leftSubject = subjectsById[leftId];
    var rightSubject = subjectsById[rightId];

    var isMarkedNonDuplicate = (
        leftSubject.scientific
        .state.internals.nonDuplicateIds?.includes(rightId)
    ) && (
        rightSubject.scientific
        .state.internals.nonDuplicateIds?.includes(leftId)
    );

    var sendMergeLeft = useSend(() => ({
        type: 'subject/merge-duplicate',
        payload: { sourceSubjectId: rightId, targetSubjectId: leftId }
    }), { onSuccessfulUpdate: () => (
        onSuccessfulMerge({ mergedId: rightId })
    ) });
    
    var sendMergeRight = useSend(() => ({
        type: 'subject/merge-duplicate',
        payload: { sourceSubjectId: leftId, targetSubjectId: rightId }
    }), { onSuccessfulUpdate: () => (
        onSuccessfulMerge({ mergedId: leftId })
    ) });

    var sendMark = useSend(() => ({
        type: 'subject/mark-non-duplicates',
        payload: { subjectIds: [ leftId, rightId ]}
    }), { onSuccessfulUpdate: onSuccessfulMark });

    var sendUnmark = useSend(() => ({
        type: 'subject/unmark-non-duplicates',
        payload: { subjectIds: [ leftId, rightId ]}
    }), { onSuccessfulUpdate: onSuccessfulUnmark });

    var cls = 'bg-light border p-3 mb-3 d-flex justify-content-center gapx-3 align-items-center';
    var bag = { className: 'px-3', size: 'sm' };

    return isMarkedNonDuplicate ? (
        <div className={ cls }>
            <i className='text-primary'>
                { translate('MARKED: Not a Duplicate') }
            </i>
            <AsyncButton { ...bag } { ...sendUnmark.passthrough }>
                <Icons.ArrowCounterclockwise style={{
                    width: '18px', height: '18px', marginTop: '-2px'
                }} />
                {' '}
                { translate('Undo') }
            </AsyncButton>
        </div>
    ) : (
        <div className={ cls }>
            <SafeMergeModal
                { ...mergeRightModal.passthrough }
                sourceSubject={ leftSubject }
                targetSubject={ rightSubject }
                onSuccessfulMerge={ onSuccessfulMerge }
            />
            <Button { ...bag } onClick={ mergeRightModal.handleShow }>
                { translate('Merge') }
                {' '}
                <Icons.ChevronDoubleRight style={{
                    width: '18px', height: '18px', marginTop: '-2px'
                }} />
            </Button>

            <AsyncButton { ...bag } { ...sendMark.passthrough }>
                { translate('Not a Duplicate') }
            </AsyncButton>
            
            <SafeMergeModal
                { ...mergeLeftModal.passthrough }
                sourceSubject={ rightSubject }
                targetSubject={ leftSubject }
                onSuccessfulMerge={ onSuccessfulMerge }
            />
            <Button { ...bag } onClick={ mergeLeftModal.handleShow }>
                <Icons.ChevronDoubleLeft style={{
                    width: '18px', height: '18px', marginTop: '-2px'
                }} />
                {' '}
                { translate('Merge') }
            </Button>
        </div>
    )
}

var SafeMergeModal = WithDefaultModal({
    title: 'Merge',
    Body: (ps) => {
        var { onHide, sourceSubject, targetSubject, onSuccessfulMerge } = ps;
        var { _id: sourceSubjectId, _recordLabel: sourceLabel } = sourceSubject;
        var { _id: targetSubjectId, _recordLabel: targetLabel } = targetSubject;
    
        var [{ translate }] = useI18N();

        var sendMerge = useSend(() => ({
            type: 'subject/merge-duplicate',
            payload: { sourceSubjectId, targetSubjectId }
        }), { onSuccessfulUpdate: [
            () => onSuccessfulMerge({ mergedId: sourceSubjectId }),
            onHide
        ] });

        return (
            <div>
                <div>
                    { translate('Really merge subjects?') }
                </div>
                <div>
                    <b>{ sourceLabel } -> { targetLabel }</b>
                </div>
                <hr />
                <SmallFormFooter>
                    <AsyncButton size='sm' { ...sendMerge.passthrough }>
                        { translate('Merge') }
                    </AsyncButton>
                </SmallFormFooter>
            </div>
        )
    }
})

export default ActionBar;
