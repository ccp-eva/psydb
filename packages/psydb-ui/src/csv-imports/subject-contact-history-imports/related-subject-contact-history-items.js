import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Table,
    SubjectIconButton,
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';

const RelatedItems = (ps) => {
    var { csvImportId, revision } = ps;

    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCSVSubjectContactHistoryImportItems({
            csvImportId
        })
    ), [ csvImportId, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = __fixRelated(fetched.data)
    if (records.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
    }

    return (
        <Table className='bg-white'>
            <thead>
                <tr>
                    <th>{ translate('Type') }</th>
                    <th>{ translate('Subject') }</th>
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
    );
}

const Item = (ps) => {
    var { record, related } = ps;
    var { _id, type, subjectId, subjectType, contactedAt, contactedBy }
        = record;
    var { status, comment } = record.state;

    var [{ locale, translate }] = useI18N();
   
    var uri = `/subjects/${subjectType}/${subjectId}`;

    return (
        <tr>
            <td>{ translate(`_subjectContactType_${type}`) }</td>
            <td>{ related.records.subject?.[subjectId]?._recordLabel }</td>
            <td>
                { datefns.format(new Date(contactedAt), 'P p', { locale }) }
            </td>
            <td>{
                related.records.personnel?.[contactedBy]?._recordLabel
                || <i className='text-lightgrey'>{ translate('Not Specified') }</i>
            }</td>
            <td>{ translate(`_subjectContactStatus_${status}`) }</td>
            <td>{ comment }</td>
            <td>
                <div className='d-flex justify-content-end'>
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
                </div>
            </td>
        </tr>
    )
}

export default RelatedItems; 
