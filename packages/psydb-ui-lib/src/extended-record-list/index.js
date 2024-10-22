import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import {
    useFetch,
    usePaginationURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';


const ExtendedRecordList = (ps) => {
    var { crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = fromData;

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetch('/study/extendedSearch', {
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
    var definitions = __fixRefinitions(displayFieldData);

    var selectedColumnDefinitions = prepareSelectedColumnDefinitions({
        columns, definitions
    });

    return (
        <div>
            <TableFNs pagination={ pagination } formData={ formData } />
            { records.length > 0 ? (
                <Table
                    definitions={ selectedColumnDefinitions }
                    records={ records }
                    related={ related }
                />
            ) : (
                <TableFallback definitions={ selectedColumnDefinitions} />
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

export default ExtendedRecordList;
