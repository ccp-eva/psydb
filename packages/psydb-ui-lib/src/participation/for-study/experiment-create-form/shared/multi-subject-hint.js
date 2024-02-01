import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const MultiSubjectHint = (ps) => {
    var { isGrouped } = ps;

    var translate = useUITranslation();
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
