import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { ExperimentIconButton } from '@mpieva/psydb-ui-layout';

import { Cell } from './utils';

const ExperimentCell = (ps) => {
    var { experimentRecord } = ps;
    var { _id, type, state: { interval }} = experimentRecord;
    var { start, end } = interval;
    
    var [{ fdate }] = useI18N();

    return (
        <Cell>
            { fdate(start, 'P p') } - { fdate(end, 'p') }
            {' '}
            <ExperimentIconButton
                to={`/experiments/${type}/${_id}`}
                target='_blank'
            />
        </Cell>
    )
}

export default ExperimentCell;
