import React from 'react';
import { useRouteMatch } from 'react-router';
import { JsonBase64 } from '@cdxoo/json-base64';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSelectionReducer } from '@mpieva/psydb-ui-hooks';
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

    var selection = useSelectionReducer({
        defaultSelection: [
            '/gdpr/state/custom/lastname',
            '/scientific/state/custom/dateOfBirth',
        ]
    });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection: 'subject', recordType, wrap: true
        })
    ), [ recordType ]);

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
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subject.listDuplicates({
            recordType,
            inspectedPointers: selection.value
        })
    ), [ recordType, selection.value.join() ]);

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
                    <TableHeadCustomCols definitions={ inspectedFields } />
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
