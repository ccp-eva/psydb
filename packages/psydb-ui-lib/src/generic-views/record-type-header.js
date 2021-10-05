import React from 'react';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

const RecordTypeHeader = ({
    url,
    label,
}) => {
    return (
        <header>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    Typ: { label }
                </h5>
            </LinkContainer>
        </header>
    )
}

export default RecordTypeHeader;
