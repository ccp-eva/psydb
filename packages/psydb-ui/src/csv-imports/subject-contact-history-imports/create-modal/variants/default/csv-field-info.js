import React from 'react';
import { CSVColumnInfo } from '@mpieva/psydb-ui-lib/csv-import';

const CSVFieldInfo = (ps) => {
    return <CSVColumnInfo columns={ columns } />
}

var columns = [
    {
        csvkey: 'subjectId', examples: [ '2345' ], isRequired: true,
        description: '_csvColumnInfo_contactHistory_subjectId',
    },
    {
        csvkey: 'contactType', examples: [ 'email', 'phone' ],
        isRequired: true,
        description: '_csvColumnInfo_contactHistory_contactType',
    },
    {
        csvkey: 'date', examples: [ '2001-12-20', '20.12.2001' ],
        isRequired: true,
        description: '_csvColumnInfo_contactHistory_date',
    },
    {
        csvkey: 'time', examples: [ '16:30' ],
        description: '_csvColumnInfo_contactHistory_time',
    },
    {
        csvkey: 'contactedBy', examples: [ '3456' ], isRequired: true,
        description: '_csvColumnInfo_contactHistory_contactedBy',
    },
    {
        csvkey: 'status', examples: [
            'sent', 'delivered', 'contact-successful',
            'mailbox', 'contact-failed'
        ],
        description: '_csvColumnInfo_contactHistory_status',
    },
    {
        csvkey: 'comment', examples: [ 'some comment' ],
        description: '_csvColumnInfo_contactHistory_comment',
    },
];

export default CSVFieldInfo;
