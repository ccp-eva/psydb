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


const List = (ps) => {
    var translate = useUITranslation();
    var revision = useRevision();
    var createModal = useModalReducer();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchCSVImports()
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
            <Button onClick={ () => onCreate() }>
                { translate('New Import') }
            </Button>

            <RecordTable { ...fetched.data } />
        </>
    )
}

const CreateModal = () => {
    return null;
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

export default List;
