import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';

const OnlineId = (ps) => {
    var { show, value } = ps;
    var [{ translate }] = useI18N();
    
    if (!show || !value) {
        return null;
    }

    return (
        <Pair 
            label={ translate('Online ID Code') }
            wLeft={ 3 } wRight={ 9 } className='px-3'
        >
            { value }
        </Pair>
    );
}

export default OnlineId;
