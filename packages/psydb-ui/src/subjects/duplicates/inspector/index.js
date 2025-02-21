import React, { useState } from 'react';
import { useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Grid } from '@mpieva/psydb-ui-layout';

import DupGroupSummary from './dup-group-summary';
import ItemSelect from './item-select';
import SubjectContainer from './subject-container';

const Inspector = (ps) => {
    var { recordType } = ps;
    var [ query, updateQuery ] = useURLSearchParamsB64();

    var { items } = query;

    var leftState = useState(items[0]._id);
    var rightState = useState(items[1]._id);

    var [ leftId ] = leftState;
    var [ rightId ] = rightState;

    var containerBag = { dupGroup: query, recordType }
    return (
        <>
            <div className='bg-light p-3 border mb-3'>
                <DupGroupSummary group={ query } />
            </div>
            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div className=''>
                    <SubjectContainer
                        state={ leftState }
                        mergeTargetId={ rightId }
                        direction='right'
                        { ...containerBag }
                    />
                </div>
                <div className=''>
                    <SubjectContainer
                        state={ rightState }
                        mergeTargetId={ leftId }
                        direction='left'
                        { ...containerBag }
                    />
                </div>
            </Grid>
        </>
    )
}




export default Inspector;
