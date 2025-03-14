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
        leftExperiments,
        rightId,
        rightExperiments,

        onSuccessfulMerge,
        onSuccessfulRemove,
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
            <MergeOrRemove
                direction='right'
                targetSubject={ rightSubject }
                sourceSubject={ leftSubject }
                sourceExperiments={ leftExperiments }
                onSuccessfulMerge={ onSuccessfulMerge }
                onSuccessfulRemove={ onSuccessfulRemove }
            />

            <AsyncButton { ...bag } { ...sendMark.passthrough }>
                { translate('Not a Duplicate') }
            </AsyncButton>
            
            <MergeOrRemove
                direction='left'
                targetSubject={ leftSubject }
                sourceSubject={ rightSubject }
                sourceExperiments={ rightExperiments }
                onSuccessfulMerge={ onSuccessfulMerge }
                onSuccessfulRemove={ onSuccessfulRemove }
            />
        </div>
    )
}

var MergeOrRemove = (ps) => {
    var {
        direction,
        targetSubject, sourceSubject, sourceExperiments,
        onSuccessfulMerge, onSuccessfulRemove,
    } = ps;

    var [{ translate }] = useI18N();
   
    var mergeModal = useModalReducer();
    var removeModal = useModalReducer();

    var canRemove = (
        sourceExperiments?.past?.length === 0
        && sourceExperiments?.future?.length === 0
    );
    console.log(sourceExperiments);
    console.log({ canRemove });

    var bag = {
        className: 'px-3', size: 'sm',
        variant: canRemove ? 'danger': 'primary'
    };
    return canRemove ? (
        <>
            <SafeRemoveModal
                { ...removeModal.passthrough }
                subject={ sourceSubject }
                onSuccessfulRemove={ onSuccessfulRemove }
            />
            <Button { ...bag } onClick={ removeModal.handleShow }>
                { translate('Delete') }
            </Button>
        </>
    ) : (
        <>
            <SafeMergeModal
                { ...mergeModal.passthrough }
                sourceSubject={ sourceSubject }
                targetSubject={ targetSubject }
                onSuccessfulMerge={ onSuccessfulMerge }
            />
            { direction === 'right' ? (
                <Button { ...bag } onClick={ mergeModal.handleShow }>
                    { translate('Merge') }
                    {' '}
                    <Icons.ChevronDoubleRight style={{
                        width: '18px', height: '18px', marginTop: '-2px'
                    }} />
                </Button>
            ) : (
                <Button { ...bag } onClick={ mergeModal.handleShow }>
                    <Icons.ChevronDoubleLeft style={{
                        width: '18px', height: '18px', marginTop: '-2px'
                    }} />
                    {' '}
                    { translate('Merge') }
                </Button>
            )}
        </>
    )
}

var SafeRemoveModal = WithDefaultModal({
    title: 'Delete',
    Body: (ps) => {
        var { onHide, subject, onSuccessfulRemove } = ps;
        var { _id: subjectId, _recordLabel: label } = subject;
        
        var [{ translate }] = useI18N();
        
        var sendRemove = useSend(() => ({
            type: 'subject/remove',
            payload: { id: subjectId }
        }), { onSuccessfulUpdate: [
            () => onSuccessfulRemove({ removedId: subjectId }),
            onHide
        ] });

        return (
            <div>
                <div>
                    { translate('Really delete this subject?') }
                </div>
                <div>
                    <b>{ label }</b>
                </div>
                <hr />
                <SmallFormFooter>
                    <AsyncButton
                        size='sm' variant='danger'
                        { ...sendRemove.passthrough }
                    >
                        { translate('Delete') }
                    </AsyncButton>
                </SmallFormFooter>
            </div>
        )
    }
})

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
