import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const CalendarPostprocessingStatus = (ps) => {
    var { isPostprocessed, hasProcessedSubjects, shouldPostprocess } = ps;
    
    var [{ translate }] = useI18N();

    var label = undefined;
    if (isPostprocessed) {
        label = translate('Completed');
    }
    else if (hasProcessedSubjects) {
        label = translate('In Postprocessing');
    }
    else if (shouldPostprocess) {
        label = translate('Open Postprocessing');
    }

    return (
        label
        ? <small className='d-block'>{ label }</small>
        : null
    )
}
