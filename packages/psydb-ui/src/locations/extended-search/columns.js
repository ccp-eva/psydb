import React from 'react';

import { gatherCustomColumns } from '@mpieva/psydb-common-lib';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, schema } = ps;
    
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    var customColumns = gatherCustomColumns({ schema });

    var sortableColumns = [
        { pointer: '/sequenceNumber', label: translate('ID No.') },
        ...(permissions.isRoot() ? [
            { pointer: '/_id', label: translate('Internal ID') }
        ] : []),
        ...customColumns
    ];

    var specialColumns = [
        { pointer: '/_specialStudyReverseRefs', label: translate('Studies') },
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={[
                    [
                        { pointer: '/sequenceNumber', label: translate('ID No.') },
                        ...(permissions.isRoot() ? [
                            { pointer: '/_id', label: translate('Internal ID') }
                        ] : []),
                    ],
                    customColumns,
                    specialColumns,
                ]}
            >
                <header className='mb-2 border-bottom'>
                    <b>{ translate('Sort Order') }</b>
                </header>
                <Fields.GenericEnum
                    dataXPath='$.sort.column'
                    label={ translate('Column') }
                    options={ sortableColumns.reduce((acc, it) => ({
                        ...acc,
                        [it.pointer]: it.label
                    }), {})}
                />
                <Fields.GenericEnum
                    dataXPath='$.sort.direction'
                    label={ translate('_sort_direction') }
                    options={ translate.options({
                        asc: '_sort_direction_asc',
                        desc: '_sort_direction_desc',
                    })}
                />
            </ColumnSelect>
            <div>
                <Button type='submit'>
                    { translate('Next') }
                </Button>
            </div>
        </div>
    );
}
