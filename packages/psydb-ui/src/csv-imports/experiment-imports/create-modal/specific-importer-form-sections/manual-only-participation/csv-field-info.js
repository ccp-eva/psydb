import React from 'react';
import { CSVColumnInfo } from '@mpieva/psydb-ui-lib/csv-import';

const CSVFieldInfo = (ps) => {
    return <CSVColumnInfo columns={ columns } exampleCSV={ exampleCSV } />
}

var columns = [
    {
        csvkey: 'date', examples: [ '20.12.2001', '2001-12-20' ],
        isRequired: true,
        description: '_csvColumnInfo_experiment_date',
    },
    {
        csvkey: 'time', examples: [ '16:30' ], isRequired: true,
        description: '_csvColumnInfo_experiment_time',
    },
    {
        csvkey: 'locationId',
        examples: [ '1234' ], isRequired: true,
        description: '_csvColumnInfo_experiment_locationId_simple',
    },
    {
        csvkey: 'subjectId',
        examples: [ '2345' ], isRequired: true,
        description: '_csvColumnInfo_experiment_subjectId_simple',
    },
    {
        csvkey: 'experimenterIds',
        examples: [ '3456' ], isRequired: true,
        description: '_csvColumnInfo_experiment_experimenterId_simple',
    },
    {
        csvkey: 'comment', examples: [ 'some comment' ],
        description: '_csvColumnInfo_experiment_comment',
    },
];

// NOTE: two subjects in the same appointment
var exampleCSV = {
    filename: 'example-manual-only-participation.csv',
    header: [
        'date', 'time', 'locationId', 'subjectId',
        'experimenterIds[0]', 'experimenterIds[1]', 'comment'
    ],
    rows: [
        [
            '20.12.2001', '16:30', '1234', '2345',
            '3456', '3457', 'Some Comment'
        ],
        [
            '20.12.2001', '16:30', '1234', '2346',
            '3456', '3457', 'Other Comment'
        ],
    ],
};

export default CSVFieldInfo;
