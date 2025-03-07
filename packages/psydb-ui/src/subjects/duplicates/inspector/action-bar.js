import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { AsyncButton } from '@mpieva/psydb-ui-layout';

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

    var sendUnark = useSend(() => ({
        type: 'subject/unmark-non-duplicates',
        payload: { subjectIds: [ leftId, rightId ]}
    }), { onSuccessfulUpdate: onSuccessfulUnmark });

    var cls = 'bg-light border p-3 mb-3 d-flex justify-content-center gapx-3';
    var bag = { className: 'px-3', size: 'sm' };

    return isMarkedNonDuplicate ? (
        <div className={ cls }>
            <b className='text-primary'>
                { translate('MARKED: Not a Duplicate') }
            </b>
        </div>
    ) : (
        <div className={ cls }>
            <AsyncButton { ...bag } { ...sendMergeRight.passthrough }>
                { translate('Merge') }
                {' ->'}
            </AsyncButton>
            <AsyncButton { ...bag } { ...sendMark.passthrough }>
                { translate('Not a Duplicate') }
            </AsyncButton>
            <AsyncButton { ...bag } { ...sendMergeLeft.passthrough }>
                {'<- '}
                { translate('Merge') }
            </AsyncButton>
        </div>
    )
}

export default ActionBar;
