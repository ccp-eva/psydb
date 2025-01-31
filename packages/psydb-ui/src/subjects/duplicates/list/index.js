import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { URL } from '@mpieva/psydb-ui-utils';
import { Table, TableHead, LoadingIndicator } from '@mpieva/psydb-ui-layout';
import {
    TableHeadCustomCols,
    TableBodyCustomCols
} from '@mpieva/psydb-custom-fields-ui';

const DuplicatesList = (ps) => {
    var { recordType } = ps;
    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subject.listDuplicates({
            recordType,
            inspectedPointers: [
                '/gdpr/state/custom/lastname',
                '/scientific/state/custom/dateOfBirth',
            ]
        })
    ), [ recordType ]);

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
        <Table>
            <TableHead showActionColumn={ false }>
                <TableHeadCustomCols definitions={ inspectedFields } />
                <th>
                    { translate('Duplicates') }
                </th>
            </TableHead>
            <tbody>
                { aggregateItems.map((it, ix) => (
                    <DuplicateGroup key={ ix } items={ it } { ...sharedBag} />
                ))}
            </tbody>
        </Table>
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
