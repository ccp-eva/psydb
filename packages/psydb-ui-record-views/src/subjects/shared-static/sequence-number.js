import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';

const SequenceNumber = (ps) => {
    var { show, value, uiSplit=[ 3, 9 ], className='px-3' } = ps;
    var [{ translate }] = useI18N();
    
    if (!show || !value) {
        return null;
    }

    var [ wLeft, wRight ] = uiSplit;
    return (
        <Pair 
            label={ translate('ID No.') }
            wLeft={ wLeft } wRight={ wRight } className={ className }
        >
            { value }
        </Pair>
    );
}

export default SequenceNumber;
