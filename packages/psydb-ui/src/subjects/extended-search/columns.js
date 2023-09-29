import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, crtSettings, schema } = ps;
    
    var [ language ] = useUILanguage();
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    var crt = CRTSettings({ data: crtSettings });
    var customColumns = crt.allCustomFields().map(it => {
        var { pointer, displayName, displayNameI18N = {} } = it;
        return {
            pointer,
            label: displayNameI18N[language] || displayName
        }
    });

    // FIXME: generalzie the creation of the field parts
    // see extended search/subjects/index
    var addressFields = crt.findCustomFields({ type: 'Address' });
    var addressFieldExtraBlocks = [];
    if (addressFields.length > 0) {
        for (var it of addressFields) {
            addressFieldExtraBlocks.push([
                {
                    ...it,
                    pointer: it.pointer + '/city',
                    label: `${translate('_address_city')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/postcode',
                    label: `${translate('_address_postcode')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/street',
                    label: `${translate('_address_street')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/housenumber',
                    label: `${translate('_address_housenumber')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/affix',
                    label: `${translate('_address_affix')} (${it.displayName})`
                }
            ])
        }
    }

    var sortableColumns = [
        { pointer: '/sequenceNumber', label: translate('ID No.') },
        { pointer: '/onlineId', label: translate('Online ID Code') },
        ...(permissions.isRoot() ? [
            { pointer: '/_id', label: translate('Internal ID') }
        ] : []),
        ...customColumns,

        ...addressFieldExtraBlocks.reduce((acc, block) => ([
            ...acc, ...block
        ]), []),
    ];

    var specialColumns = [
        { 
            pointer: '/_specialStudyParticipation',
            label: translate('Studies')
        },
        {
            pointer: '/_specialUpcomingExperiments',
            label: translate('Appointments')
        },
        {
            pointer: '/_specialHistoricExperimentLocations',
            label: translate('Historical Appointment Locations')
        },
        {
            pointer: '/_specialAgeToday',
            label: translate('Age Today')
        },
        {
            pointer: '/scientific/state/comment',
            label: translate('Comment')
        },
    ];

    var columnBlocks = [
        [
            { pointer: '/sequenceNumber', label: translate('ID No.') },
            { pointer: '/onlineId', label: translate('Online ID Code') },
            ...(permissions.isRoot() ? [
                { pointer: '/_id', label: translate('Internal ID') }
            ] : []),
        ],
        customColumns,
        ...addressFieldExtraBlocks,
        specialColumns,
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={ columnBlocks }
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
