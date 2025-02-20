import React, { useState } from 'react';
import { useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Grid } from '@mpieva/psydb-ui-layout';

import DupGroupSummary from './dup-group-summary';
import ItemSelect from './item-select';
import SubjectContainer from './subject-container';

const Inspector = (ps) => {
    var { recordType } = ps;
    var [ query, updateQuery ] = useURLSearchParamsB64();

    var { items, inspectedFields } = query;

    var [ leftId, setLeftId ] = useState(items[0]._id);
    var [ rightId, setRightId ] = useState(items[1]._id);

    return (
        <>
            <div className='bg-light p-3 border mb-3'>
                <DupGroupSummary group={ query } />
            </div>
            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div className='p-3 bg-light border'>
                    <ItemSelect
                        items={ items }
                        value={ leftId }
                        onChange={ setLeftId }
                        disabledId={ rightId }
                    />
                    <SubjectContainer
                        recordType={ recordType }
                        id={ leftId }
                    />
                </div>
                <div className='p-3 bg-light border'>
                    <ItemSelect
                        items={ items }
                        value={ rightId }
                        onChange={ setRightId }
                        disabledId={ leftId }
                    />
                    <SubjectContainer
                        recordType={ recordType }
                        id={ rightId }
                    />
                </div>
            </Grid>
        </>
    )
}




export default Inspector;
