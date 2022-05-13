import React from 'react';

import { useFetch, useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

const CSVExportButton = (ps) => {
    var {
        collection,
        recordType,
        constraints,
        searchOptions,
        sort,

        className
    } = ps;

    var [ filters ] = useURLSearchParamsB64();

    var fetcher = useFetch((agent) => {
        return agent.exportRecords({
            collection,
            recordType,
            searchOptions,
            
            constraints,
            filters,
            sort,
        })
    }, { useEffect: false });

    var handleExport = () => {
        fetcher.exec().then(() => {});
    }

    return (
        <Button onClick={ handleExport } className={ className }>
            CSV Export
        </Button>
    )
}

export default CSVExportButton;
