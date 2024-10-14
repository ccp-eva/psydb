import React from 'react';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Table,
    SubjectIconButton,
} from '@mpieva/psydb-ui-layout';


const RelatedSubjects = (ps) => {
    var { csvImportId, revision } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCSVSubjectImportSubjects({
            csvImportId
        })
    ), [ csvImportId, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fixRelated(fetched.data)
    if (records.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
    }

    return (
        <Table className='bg-white border'>
            <thead>
                <tr>
                    <th>{ translate('ID No.') }</th>
                    <th>{ translate('Subject') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map((it, ix) => (
                    <Item
                        key={ ix }
                        record={ it }
                        related={ related }
                    />
                ))}
            </tbody>
        </Table>
    );
}

const Item = (ps) => {
    var { record, related } = ps;
    var { _id, type, sequenceNumber, _recordLabel } = record;

    var type = record.type;
    var uri = `/subjects/${type}/${_id}`;

    return (
        <>
            <tr>
                <td>{ sequenceNumber }</td>
                <td>{ _recordLabel }</td>
                <td className='d-flex justify-content-end'>
                    <SubjectIconButton
                        to={ uri }
                        buttonStyle={{
                            marginTop: '-5px',
                            marginBottom: '-5px'
                        }}
                        iconStyle={{
                            width: '22px',
                            height: '22px',
                            marginTop: '0px',
                        }}
                    />
                </td>
            </tr>
        </>
    )
}

export default RelatedSubjects; 
