import React from 'react';
import {
    LinkButton,
    Icons,
} from '@mpieva/psydb-ui-layout';

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
                <Icons.PencilFill style={{ width: '20px', marginTop: '-3px' }} />
            </LinkButton>
            <LinkButton
                className='ml-2'
                size='sm'
                variant='outline-primary'
                to={ `${linkBaseUrl}/${record._id}/items`}
            >
                <Icons.List style={{ height: '20px', width: '20px', marginTop: '-3px' }} />
            </LinkButton>
        </>
    )
}

export default HelperSetRecordActions;
