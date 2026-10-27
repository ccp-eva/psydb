import React from 'react';
import { CSVColumnInfo } from '@mpieva/psydb-ui-lib/csv-import';

const CSVFieldInfo = (ps) => {
    return <CSVColumnInfo columns={ columns } exampleCSV={ exampleCSV } />
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
        csvkey: 'date', examples: [ '20.12.2001', '2001-12-20' ],
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

var exampleCSV = {
    filename: 'example-contact-history.csv',
    header: [
        'subjectId', 'contactType', 'date', 'time',
        'contactedBy', 'status', 'comment'
    ],
    rows: [
        [
            '2345', 'email', '20.12.2001', '16:30',
            '3456', 'sent', 'Some Comment'
        ],
        [
            '2346', 'phone', '21.12.2001', '09:15',
            '3456', 'contact-successful', 'Other Comment'
        ],
    ],
};

export default CSVFieldInfo;
