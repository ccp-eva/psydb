import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

const IsNewAlert = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <div className='text-danger small mt-3'>
            <header><b>
                { translate('New Record Type') }
            </b></header>
            <div>
                { translate('_crt_new_record_type_hint') }
            </div>
        </div>
    );
}

export default IsNewAlert;
