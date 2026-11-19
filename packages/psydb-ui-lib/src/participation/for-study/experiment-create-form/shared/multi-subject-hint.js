import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const MultiSubjectHint = (ps) => {
    var { isGrouped } = ps;

    var [{ translate }] = useI18N();
    var tag = (
        isGrouped
        ? '_participation_multi_subject_grouped_hint'
        : '_participation_multi_subject_ungrouped_hint'
    );

    return (
        <div className='text-muted'><i>
            <b>{ translate('Hint') }:</b>
            {' '}
            { translate(tag) }
        </i></div>
    );
}
