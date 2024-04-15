import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useRevision,
    useModalReducer,
    useFetch
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    Table,
    TableHead,
} from '@mpieva/psydb-ui-layout';

import CreateModal from './create-modal';

const List = (ps) => {
    var translate = useUITranslation();
    var revision = useRevision();
    var createModal = useModalReducer({
        // show: true
    });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchCSVExperimentImports()
    ), [ revision.value ]);

    if (!didFetch) {
        return <LoadingIndicator size='page' />
    }

    return (
        <>
            <CreateModal
                { ...createModal.passthrough }
                onSuccessfulUpdate={ revision.up }
            />
            <Button onClick={ createModal.handleShow }>
                { translate('New Import') }
            </Button>

            <RecordTable { ...fetched.data } />
        </>
    )
}

const RecordTable = (ps) => {
    var { records, related } = ps;
    return (
        <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>

            <TableHead showActionColumn>
                <th>FOFOFO</th>
            </TableHead>
            <tbody>
                { records.map((it, ix) => (
                    <RecordRow
                        key={ ix }
                        record={ it }
                        related={ related }
                    />
                ))}
            </tbody>
        </Table>
    )
}

const RecordRow = (ps) => {
    var { record, related } = ps;
    return (
        <>
            <td>XXX</td>
        </>
    )
}

export default List;
