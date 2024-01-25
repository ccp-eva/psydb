import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';

export const Footer = (ps) => {
    var { isTransmitting } = ps;
    var translate = useUITranslation();
    return (
        <>
            <hr />
            <div className='d-flex justify-content-end'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Save') }
                </AsyncButton>
            </div>
        </>
    )
}
