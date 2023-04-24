import React from 'react';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

export const RecordList = (ps) => {
    return (
        <RecordListContainer
            { ...ps }
            searchOptions={{
                enableResearchGroupFilter: false
            }}
            defaultSort={{
                path: 'state.label',
                direction: 'asc',
            }}
        />
    );
}
