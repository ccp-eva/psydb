import React from 'react';

import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

const CSVExtendedSearchExportButton = (ps) => {
    var {
        className,
        size,

        endpoint,
        searchData,
    } = ps;

    var fetcher = useFetch((agent) => {
        return (
            agent
            .getAxios()
            .post(`/api/extended-search-export/${endpoint}`, {
                ...searchData,
                timezone: getSystemTimezone()
            })
        )
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
        <Button
            size={ size }
            onClick={ handleExport }
            className={ className }
        >
            CSV Export
        </Button>
    )
}

export default CSVExtendedSearchExportButton;
