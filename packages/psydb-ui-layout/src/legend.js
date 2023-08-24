import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const Legend = (ps) => {
    var { children, renderHR = true, ...pass } = ps;
    var translate = useUITranslation();

    return (
        <div { ...pass }>
            <b className='d-block mb-1'><u>
                { translate('Legend') }
            </u></b>
            { children }
        </div>
    );
}
