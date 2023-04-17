import React from 'react';
import { PermissionDenied, PageWrappers } from '@mpieva/psydb-ui-layout';

const PermissionDeniedContainer = (ps) => {
    var { showTitle, title, url } = ps;

    return (
        <PageWrappers.Level1
            showTitle={ showTitle }
            title={ title }
            titleLinkUrl={ url }
        >
            <div className='mt-3'>
                <PermissionDenied />
            </div>
        </PageWrappers.Level1>
    )
}

export default PermissionDeniedContainer;
