import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

const CSVSearchExportButton = (ps) => {
    var {
        collection,
        recordType,
        constraints,
        searchOptions,
        sort,
        //showHidden,

        className
    } = ps;

    var translate = useUITranslation();
    var [ query ] = useURLSearchParamsB64();
    var { showHidden, ...filters } = query;

    var fetcher = useFetch((agent) => {
        return agent.searchExport({
            collection,
            recordType,
            searchOptions,
            
            constraints,
            filters,
            sort,
            showHidden,
        })
    }, { useEffect: false });

    var handleExport = () => {
        fetcher.exec().then((response) => {
            var { data } = response;

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
            { translate('CSV Export') }
        </Button>
    )
}

export default CSVSearchExportButton;
