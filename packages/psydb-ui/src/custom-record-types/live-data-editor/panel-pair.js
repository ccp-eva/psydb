import React from 'react';
import { arrify } from '@mpieva/psydb-core-utils';

const PanelPair = (ps) => {
    var { children } = ps;
    var [ left, right ] = arrify(children);
    return (
        <div className='d-flex'>
            <div className='w-50 mr-3'>
                { left || null }
            </div>
            <div className='w-50 ml-3'>
                { right || null }
            </div>
        </div>
    )
}

export default PanelPair;
