import React from 'react';
import { CSVColumnInfo } from '@mpieva/psydb-ui-lib/csv-import';

const CSVFieldInfo = (ps) => {
    return <CSVColumnInfo columns={ columns } />
}

var columns = [
    {
        csvkey: 'date', examples: [ '2001-12-20' ], isRequired: true,
        description: '_csvColumnInfo_experiment_date',
    },
    {
        csvkey: 'time', examples: [ '16:30' ], isRequired: true,
        description: '_csvColumnInfo_experiment_time',
    },
    {
        csvkey: 'locationId',
        examples: [ '1234' ], isRequired: true,
        description: '_csvColumnInfo_experiment_locationId',
    },
    {
        csvkey: 'subjectId',
        examples: [ '2345' ], isRequired: true,
        description: '_csvColumnInfo_experiment_subjectId',
    },
    {
        csvkey: 'experimenterId',
        examples: [ '3456' ], isRequired: true,
        description: '_csvColumnInfo_experiment_experimenterId',
    },
    {
        csvkey: 'comment', examples: [ 'some comment' ],
        description: '_csvColumnInfo_experiment_comment',
    },
];

export default CSVFieldInfo;
