import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';

export const Footer = (ps) => {
    var { isTransmitting, enableSubmit = true } = ps;
    var [{ translate }] = useI18N();
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
