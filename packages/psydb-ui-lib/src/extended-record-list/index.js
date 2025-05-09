import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { __fixDefinitions, __fixRelated } from '@mpieva/psydb-common-compat';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import {
    useFetch,
    usePaginationURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import TableFNs from './table-fns';
import TableFallback from './table-fallback';
import Table from './table';
import TableRow from './table-row';

const ExtendedRecordList = (ps) => {
    var { collection, crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = formData;

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetch(`/${collection}/extendedSearch`, {
            ...formData, offset, limit, timezone: getSystemTimezone(),
        }).then((response) => {
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        })
    ), [ offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    
    var { records, related, displayFieldData } = fetched.data;
    var definitions = __fixDefinitions(displayFieldData);
    related = __fixRelated(related, { isResponse: false });

    var selectedColumnDefinitions = prepareSelectedColumnDefinitions({
        columns, definitions
    });

    return (
        <div>
            <TableFNs
                collection={ collection }
                formData={ formData }
                pagination={ pagination }
            />
            { records.length > 0 ? (
                <Table
                    collection={ collection }
                    definitions={ selectedColumnDefinitions }
                    records={ records }
                    related={ related }
                />
            ) : (
                <TableFallback definitions={ selectedColumnDefinitions } />
            )}
        </div>
    )
}

const prepareSelectedColumnDefinitions = (bag) => {
    var { columns, definitions } = bag;
    
    var definitionsByPointer = keyBy({
        items: definitions, byProp: 'pointer'
    })

    var selectedDefinitions = [];
    for (var ptr of columns) {
        var def = definitionsByPointer[ptr];
        if (def) {
            selectedDefinitions.push(def);
        }
    }
    
    return selectedDefinitions;
}

export { 
    TableFNs,
    Table,
    TableFallback,
    TableRow,
    prepareSelectedColumnDefinitions,
}

export default ExtendedRecordList;
