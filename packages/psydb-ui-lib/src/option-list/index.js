import React from 'react';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import useTableFunctions from './use-table-functions';
import TableFNs from './table-fns';
import Table from './table';

const OptionList = (ps) => {
    var {
        collection = 'study',
        recordType = undefined,
        searchOptions,
        constraints,
        extraIds,
        excludedIds,

        onSelectRecord,
    } = ps;

    var tablefns = useTableFunctions();
    var tableprops = tablefns.getProps()
    
    var {
        filters, showHidden,
        sortPath, sortDirection,
        offset, limit,
    } = tableprops;

    var [ didFetch, fetched ] = useFetch((agent) => {
        var commonPayload = {
            target: 'optionlist',
            constraints, filters, showHidden,
            extraIds, excludedIds,
            offset, limit,

            ...(sortPath && {
                sort: { path: sortPath, direction: sortDirection }
            }),
        }

        var promise = undefined;
        if ([
            'study',
            'helperSet', 'helperSetItem'
        ].includes(collection)) {
            promise = agent.fetch(`/${collection}/list`, {
                ...commonPayload, ...(recordType && { recordType })
            });
        }
        else {
            promise = agent.searchRecords({
                ...commonPayload, collection, recordType
            });
        }

        return promise.then((response) => {
            tablefns.handleResponseExtra(response);
            return response;
        });

    }, [ filters, showHidden, sortPath, sortDirection, offset, limit ]);


    //console.log('<OptionList>');
    //console.log(tableprops);
    //console.log(fetched);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    // XXX ///////////////////
    var {
        records,
        displayFieldData,
        related,
    } = __fixRelated(fetched.data);

    var definitions = __fixDefinitions(displayFieldData);

    ////////////////////////////////

    var tableBag = {
        records, related, definitions,
        sorter: tablefns.getSorter(),
        onSelectRecord,
    }

    return (
        <div className='pt-5'>
            <TableFNs
                tablefns={ tablefns }
                displayFieldData={ displayFieldData }
            />

            <Table { ...tableBag } />
        </div>
    )
}



export default OptionList;
