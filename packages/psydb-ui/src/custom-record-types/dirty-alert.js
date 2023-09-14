import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const DirtyAlert = (ps) => {
    var translate = useUITranslation();
    return (
        <div className='text-danger small mt-3'>
            <header><b>
                { translate('Uncommited Field Changes') }
            </b></header>
            <div>
                { translate('_crt_uncommited_fields_hint') }
            </div>
        </div>
    );
}

export default DirtyAlert;
