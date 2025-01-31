import React from 'react';
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

const DuplicatesList = (ps) => {
    var { recordType } = ps;
    var [{ translate }] = useI18N();

    var selection = useSelectionReducer({
        defaultSelection: [
            '/gdpr/state/custom/lastname',
            '/scientific/state/custom/dateOfBirth',
        ]
    });

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
            <FieldSelection selection={ selection } />
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
                        { translate('No duplicates found.') }
                    </i>
                </Alert>
            )}
        </>
    )

}

var FieldSelection = (ps) => {
    var { selection } = ps;
    var { dev_subjectDuplicatesSearchFields } = useUIConfig();

    return (
        <div className='d-flex flex-wrap bg-light border p-3 gapx-3 mb-3'>
            { dev_subjectDuplicatesSearchFields.child.map((it, ix) => (
                <Controls.PlainCheckbox
                    key={ ix }
                    id={ it }
                    label={ it }
                    value={ selection.value.includes(it) }
                    onChange={ () => selection.toggle(it)}
                />
            ))}
        </div>
    )
}

const DuplicateGroup = (ps) => {
    var { items, recordType, inspectedFields, related } = ps;

    var sharedBag = { inspectedFields, related };
    return (
        <tr>
            <TableBodyCustomCols
                record={ items[0] }
                related={ related }
                definitions={ inspectedFields }
            />
            <td>
                { items.map((it, ix) => (
                    <b className='bg-light' key={ ix }>
                        <a
                            className='d-inline-lock border mr-2 px-2'
                            href={`#/subjects/${recordType}/${it._id}`}
                        >
                            { it._label }
                        </a>
                    </b>
                ))}
            </td>
        </tr>
    )
}

export default DuplicatesList;
