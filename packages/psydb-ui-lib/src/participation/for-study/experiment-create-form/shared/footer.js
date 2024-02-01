import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';

export const Footer = (ps) => {
    var { isTransmitting, enableSubmit = true } = ps;
    var translate = useUITranslation();
    return (
        <>
            <hr />
            <div className='d-flex justify-content-end'>
                <AsyncButton
                    type='submit'
                    disabled={ !enableSubmit }
                    isTransmitting={ isTransmitting }
                >
                    { translate('Save') }
                </AsyncButton>
            </div>
        </>
    )
}
