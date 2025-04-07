import React from 'react';
import { useRouteMatch } from 'react-router';
import { JsonBase64 } from '@cdxoo/json-base64';
import {
    convertPointerToPath,
    convertPathToPointer
} from '@mpieva/psydb-core-utils';

import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    useSelectionReducer,
    useSortReducer,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import { URL } from '@mpieva/psydb-ui-utils';

import {
    Table as BSTable,
    TableHead,
    LoadingIndicator,
    Alert,
} from '@mpieva/psydb-ui-layout';

import * as Controls from '@mpieva/psydb-ui-form-controls';
import {
    TableHeadCustomCols,
    TableBodyCustomCols
} from '@mpieva/psydb-custom-fields-ui';

import FieldSelection from './field-selection';
import DuplicateGroup from './duplicate-group';

const DuplicatesList = (ps) => {
    var { recordType } = ps;
    var [{ translate }] = useI18N();

    var [ query, updateQuery ] = useURLSearchParamsB64();
    var selection = {
        value: query.fields || [
            '/gdpr/state/custom/lastname',
            '/scientific/state/custom/dateOfBirth',
        ],
        toggle: (next) => {
            var fields = selection.value;
            fields.includes(next) ? (
                updateQuery({ fields: fields.filter(it => it !== next) })
            ) : (
                updateQuery({ fields: [ ...fields, next ]})
            )
        }
    }

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection: 'subject', recordType, wrap: true
        })
    ), {
        dependencies: [ recordType ],
        resetDidFetchOnDependencyChange: true
    });

    if (!didFetch) {
        return <LoadingIndicator size='xl' />
    }

    // FIXME: that response is BS
    var crtSettings = fetched.data;

    var content = (
        selection.value.length < 1
        ? (
            <Alert variant='info'>
                <i className='text-muted'>
                    { translate('Please select at least one field.') }
                </i>
            </Alert>
        )
        : <FetchingTable recordType={ recordType } selection={ selection } />
    )

    return (
        <>
            <FieldSelection
                crtSettings={ crtSettings }
                selection={ selection }
            />
            { content }
        </>
    )       
}

var FetchingTable = (ps) => {
    var { recordType, selection } = ps;
    var [{ translate }] = useI18N();
    
    var defaultSortPath = convertPointerToPath(selection.value[0]);
    var sorter = useSortReducer({
        sortPath: defaultSortPath,
        sortDirection: 'asc'
    }); // FIXME: create a raw sorter that is not a reducer
    var { sortPath, sortDirection } = sorter;

    if (sortPath) {
        var sortPointer = convertPathToPointer(sortPath)
        if (!selection.value.includes(sortPointer)) {
            sortPath = defaultSortPath;
        }
    }
    else {
        sortPath = defaultSortPath;
    }
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subject.listDuplicates({
            recordType,
            inspectedPointers: selection.value,
            sort: { path: sortPath, direction: sortDirection || 'asc' },
        })
    ), [ recordType, selection.value.join(), sortPath, sortDirection ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        aggregateItems,
        inspectedFields,
        related
    } = fetched.data;

    var sharedBag = { recordType, inspectedFields, related };
    return (
        <>
            <BSTable className='mb-2'>
                <TableHead showActionColumn={ false }>
                    <TableHeadCustomCols
                        definitions={ inspectedFields }
                        sorter={ sorter } canSort={ true }
                    />
                    <th>{ translate('Duplicates') }</th>
                    <th></th>
                </TableHead>
                <tbody>
                    { aggregateItems.map((it, ix) => (
                        <DuplicateGroup
                            key={ ix } items={ it } { ...sharedBag}
                        />
                    ))}
                </tbody>
            </BSTable>
            
            { aggregateItems.length < 1 && (
                <Alert variant='info'>
                    <i className='text-muted'>
                        { translate('No possible duplicates found.') }
                    </i>
                </Alert>
            )}
        </>
    )

}

export default DuplicatesList;
