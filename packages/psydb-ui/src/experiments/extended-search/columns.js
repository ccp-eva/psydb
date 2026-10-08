import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { keyBy } from '@mpieva/psydb-core-utils';
import { SmartArray } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    
    var idColumns = SmartArray([
        ( permissions.isRoot() && (
            { pointer: '/_id', label: translate('Internal ID') }
        )),
    ]);

    var staticColumns = [
        { pointer: '/type', label: translate('Lab Workflow') },
        { pointer: '/state/interval/start', label: translate('Start') },
        { pointer: '/state/interval/end', label: translate('End') },
        { pointer: '/state/studyId', label: translate('Study') },
        { pointer: '/state/locationId', label: translate('Location') },
        { pointer: '/state/experimentOperatorTeamId', label: translate('Team') },
        { pointer: '/state/experimentOperatorIds', label: translate('Experimenters') },
        { pointer: '/state/selectedSubjectIds', label: translate('Subjects') },
        { pointer: '/state/isCanceled', label: translate('Canceled') },
        { pointer: '/state/isPostprocessed', label: translate('Postprocessed') },
    ];

    var sortableColumns = [
        ...idColumns,
        { pointer: '/type', label: translate('Lab Workflow') },
        { pointer: '/state/interval/start', label: translate('Start') },
        { pointer: '/state/interval/end', label: translate('End') },
        { pointer: '/state/isCanceled', label: translate('Canceled') },
        { pointer: '/state/isPostprocessed', label: translate('Postprocessed') },
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={[
                    idColumns,
                    staticColumns,
                ]}
            >
                <header className='mb-2 border-bottom'>
                    <b>{ translate('Sort Order') }</b>
                </header>
                <Fields.GenericEnum
                    dataXPath='$.sort.column'
                    label={ translate('Column') }
                    options={ keyBy({
                        items: sortableColumns, byProp: 'pointer',
                        transform: it => it.label
                    })}
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
