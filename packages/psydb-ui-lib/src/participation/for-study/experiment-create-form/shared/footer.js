import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

export const Footer = (ps) => {
    var translate = useUITranslation();
    return (
        <>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button type='submit'>
                    { translate('Save') }
                </Button>
            </div>
        </>
    )
}
