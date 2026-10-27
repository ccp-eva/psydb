import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Alert, Table } from '@mpieva/psydb-ui-layout';


const SubjectContactHistoryList = (ps) => {
    var { subjectId, revision = {} } = ps;

    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subjectContactHistory.list({ subjectId })
    ), [ subjectId, revision.value ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data
    if (records.length < 1) {
        return (
            <Alert variant='info'>
                <i>{ translate('No contact history found.') }</i>
            </Alert>
        )
    }

    return (
        <Table className='bg-white border'>
            <thead>
                <tr>
                    <th>{ translate('Type') }</th>
                    <th>{ translate('Contacted At') }</th>
                    <th>{ translate('Contacted By') }</th>
                    <th>{ translate('Status') }</th>
                    <th>{ translate('Comment') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map((it, ix) => (
                    <Item key={ ix } record={ it } related={ related } />
                ))}
            </tbody>
        </Table>
    )
}

const Item = (ps) => {
    var { record, related } = ps;
    var { _id, type, csvImportId, contactedAt, contactedBy } = record;
    var { status, comment } = record.state;

    var [{ translate, fdate }] = useI18N();

    //var uri = `/experiments/${type}/${record._id}`;

    return (
        <tr>
            <td>{ translate(`_subjectContactType_${type}`) }</td>
            <td>{ fdate(contactedAt, 'P p') }</td>
            <td>{
                related.records.personnel?.[contactedBy]
                || <i className='text-lightgrey'>{ translate('Not Specified') }</i>
            }</td>
            <td>{ translate(`_subjectContactStatus_${status}`) }</td>
            <td>{ comment }</td>
            <td className='d-flex justify-content-end'>
                {/*<ExperimentIconButton to={ uri } />*/}
            </td>
        </tr>
    )
}

export default SubjectContactHistoryList;
