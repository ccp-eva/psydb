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
        fetcher.exec().then((response) => {
            var { data } = response;
            console.log(data);

            var blob = new Blob(
                [ data ],
                {
                    encoding: "UTF-8",
                    type: "application/force-download;charset=UTF-8"
                }
            );

            var csvURL = window.URL.createObjectURL(blob);
            var tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', `${collection}-export.csv`);

            // firefox needs the link to be appended to the body
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        });
    }

    return (
        <Button onClick={ handleExport } className={ className }>
            CSV Export
        </Button>
    )
}

export default CSVExportButton;
