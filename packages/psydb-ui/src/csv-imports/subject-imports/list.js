import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
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
    LinkTD
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';

import CreateModal from './create-modal';

const List = (ps) => {
    var translate = useUITranslation();
    var revision = useRevision();
    var createModal = useModalReducer({
        show: true
    });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchCSVSubjectImports()
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
    var translate = useUITranslation();
    return (
        <Table
            className='mt-3'
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
            hover={ true }
        >
            <TableHead showActionColumn>
                <th>{ translate('Subject Type') }</th>
                <th>{ translate('Imported At') }</th>
                <th>{ translate('Imported By') }</th>
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
    var { _id, subjectType, createdAt, createdBy } = record;
    
    var { url } = useRouteMatch();
    var translate = useUITranslation();
    var locale = useUILocale();
    
    return (
        <>
            <LinkRow href={ `#${url}/${_id}` } values={[
                translate.crt(related.crts.subject[subjectType]),
                datefns.format(new Date(createdAt), 'P p', { locale }),
                related.records.personnel[createdBy],
            ]} />
        </>
    )
}

// FIXME: redundant
var LinkRow = (ps) => {
    var { href, values } = ps;

    return (
        <tr>
            { values.map((it, ix) => (
                <LinkTD key={ ix } href={ href }>{ it }</LinkTD>
            ))}
        </tr>
    )
}
export default List;
