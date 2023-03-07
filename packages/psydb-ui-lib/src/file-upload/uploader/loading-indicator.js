import React from 'react';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

var IndicatorWrapper = (ps) => (
    <div style={{ overflow: 'hidden'}}>
        <LoadingIndicator { ...ps } />
    </div>
);

export default IndicatorWrapper;
