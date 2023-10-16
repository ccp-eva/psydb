import React from 'react';
import {
    EditIconButtonInline,
    ItemsIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import HelperSetDefaultListContainer from './helper-set-default-list-container';

export const RecordList = (ps) => (
    <HelperSetDefaultListContainer
        { ...ps }
        CustomActionListComponent={ Actions }
    />
);

const Actions = ({
    linkBaseUrl,
    record,
}) => {
    return (
        <>
            <EditIconButtonInline
                to={ `${linkBaseUrl}/${record._id}/edit`}
            />
            <ItemsIconButtonInline
                to={ `${linkBaseUrl}/${record._id}/items`}
            />
        </>
    )
}
