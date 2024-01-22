import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

export const Footer = (ps) => {
    return (
        <>
            <hr />
            <div className='d-flex justify-content-start'>
                <Button type='submit'>Speichern</Button>
            </div>
        </>
    )
}
