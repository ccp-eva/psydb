import React from 'react';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

const RecordTypeHeader = ({
    url,
    label,
}) => {
    return (
        <header>
            <h5 className='mt-0 mb-3 text-muted'>
                <LinkContainer to={ url }>
                    <span role='button'>Typ: { label }</span>
                </LinkContainer>
            </h5>
        </header>
    )
}

export default RecordTypeHeader;
