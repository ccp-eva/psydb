import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, LoadingIndicator, Table }
    from '@mpieva/psydb-ui-layout';


const SubjectContactHistoryModalBody = (ps) => {
    var { modalPayloadData } = ps;
    var { subjectId } = modalPayloadData;
    
    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.subjectContactHistory.list({ subjectId })
    ), [ subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data
    if (records.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
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
            <td>{ type }</td>
            <td>{ fdate(contactedAt, 'P p') }</td>
            <td>{
                related.records.personnel?.[contactedBy]
                || <i className='text-lightgrey'>{ translate('Not Specified') }</i>
            }</td>
            <td>{ status }</td>
            <td>{ comment }</td>
            <td className='d-flex justify-content-end'>
                {/*<ExperimentIconButton to={ uri } />*/}
            </td>
        </tr>
    )
}

const SubjectContactHistoryModal = WithDefaultModal({
    Body: SubjectContactHistoryModalBody,
    title: 'Contact History',
    size: 'lg',
    className: '',
    backdropClassName: '',
});

export default SubjectContactHistoryModal;
