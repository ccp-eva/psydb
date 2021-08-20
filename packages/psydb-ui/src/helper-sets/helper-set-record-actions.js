import React from 'react';
import { PencilFill, List } from 'react-bootstrap-icons';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';

const HelperSetRecordActions = ({
    linkBaseUrl,
    record,
}) => {
    return (
        <>
            <LinkButton
                size='sm'
                variant='outline-primary'
                to={ `${linkBaseUrl}/${record._id}/edit`}
            >
                <PencilFill style={{ width: '20px', marginTop: '-3px' }} />
            </LinkButton>
            <LinkButton
                className='ml-2'
                size='sm'
                variant='outline-primary'
                to={ `${linkBaseUrl}/${record._id}/items`}
            >
                <List style={{ height: '20px', width: '20px', marginTop: '-3px' }} />
            </LinkButton>
        </>
    )
}

export default HelperSetRecordActions;
