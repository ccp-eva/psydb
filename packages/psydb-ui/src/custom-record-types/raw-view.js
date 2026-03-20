import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { JsonRaw } from '@mpieva/psydb-ui-layout';

const RawView = (ps) => {
    var { record } = ps;
    var [{ translate }] = useI18N();

    return (
        <JsonRaw data={ record } />
    )
}

export default RawView;
