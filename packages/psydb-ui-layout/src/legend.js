import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const Legend = (ps) => {
    var { children, renderHR = true, ...pass } = ps;
    var [{ translate }] = useI18N();

    return (
        <div { ...pass }>
            <b className='d-block mb-1'><u>
                { translate('Legend') }
            </u></b>
            { children }
        </div>
    );
}
