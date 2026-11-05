import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Alert, Table } from '@mpieva/psydb-ui-layout';

export const TableFallback = (ps) => {
    var { TableHead, renderedTableHead, text } = ps;
    var [{ translate }] = useI18N();
    return (
        <>
            <Table className='mb-1'>
                { renderedTableHead || <TableHead /> }
            </Table>
            <Alert variant='info'>
                <i>{ text }</i>
            </Alert>
        </>
    )
}

export const Cell = ({ children }) => (
    <td style={{ verticalAlign: 'middle' }}>
        { children }
    </td>
)

export const getSubjectLabel = ({ related, subjectId }) => (
    related.records.subject[subjectId]._recordLabel
)
export const getStudyLabel = ({ related, studyId }) => (
    related.records.study[studyId]._recordLabel
)
