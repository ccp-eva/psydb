import React, { useEffect } from 'react';
import { withField } from '@cdxoo/formik-utils';

import { keyBy } from '@mpieva/psydb-core-utils';
import { SmartArray, CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData } = ps;
    var subjectType = formData?.specialFilters?.subjectType;

    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        subjectType
        ? agent.readCRTSettings({ collection: 'subject', recordType: subjectType })
        : undefined
    ), [ subjectType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var subjectColumns = (
        subjectType && fetched.data
        ? createSubjectColumns({
            crtSettings: fetched.data, permissions, translate
        })
        : []
    );
    
    var idColumns = SmartArray([
        ( permissions.isRoot() && (
            { pointer: '/_id', label: translate('Internal ID') }
        )),
    ]);

    var staticColumns = [
        { pointer: '/type', label: translate('Lab Workflow') },
        { pointer: '/state/interval/start', label: translate('Date/Time') },
        { pointer: '/state/studyId', label: translate('Study') },
        { pointer: '/state/locationId', label: translate('Location') },
        { pointer: '/state/experimentOperatorIds', label: translate('Experimenters') },
        { pointer: '/state/selectedSubjectIds', label: translate('Subject') },
        { pointer: '/_participationStatus', label: translate('Status') },
        { pointer: '/state/isPostprocessed', label: translate('Postprocessed') },
    ];

    var sortableColumns = [
        ...idColumns,
        { pointer: '/type', label: translate('Lab Workflow') },
        { pointer: '/state/interval/start', label: translate('Date/Time') },
        { pointer: '/state/isPostprocessed', label: translate('Postprocessed') },
    ];

    var availablePointers = [
        ...idColumns, ...staticColumns, ...subjectColumns
    ].map(it => it.pointer);

    return (
        <div className='bg-light p-3 border border-top-0'>
            <PruneUnavailableColumns
                columns={ formData?.columns }
                availablePointers={ availablePointers }
            />
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={ SmartArray([
                    idColumns,
                    staticColumns,
                    ( subjectColumns.length > 0 && subjectColumns ),
                ]) }
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

// NOTE: selected columns might not be available e.g. when a link
// presets subject columns that the subject type doesnt have
const PruneUnavailableColumns = (ps) => {
    var { columns = [], availablePointers } = ps;
    var { setFieldValue } = useFormikContext();

    var pruned = columns.filter(it => availablePointers.includes(it));
    var shouldPrune = pruned.length !== columns.length;

    useEffect(() => {
        if (shouldPrune) {
            setFieldValue('$.columns', pruned);
        }
    }, [ shouldPrune ]);

    return null;
}

// NOTE: subject columns are prefixed with '/_subject', see
// experiment/extendedSearch endpoint
const createSubjectColumns = (bag) => {
    var { crtSettings, permissions, translate } = bag;
    var {
        showSequenceNumber,
        showOnlineId,
        commentFieldIsSensitive,
    } = crtSettings;

    var canAccessSensitive = permissions.hasFlag('canAccessSensitiveFields');

    var crt = CRTSettings({ data: crtSettings });
    var customFields = crt.findCustomFields({
        'isRemoved': { $ne: true },
        $or: [
            { 'props.isSensitive': { $ne: true }},
            { 'props.isSensitive': canAccessSensitive },
        ]
    });
    var customColumns = customFields.map(it => ({
        pointer: it.pointer,
        label: translate.fieldDefinition(it),
    }));
    var hasDateOfBirthField = customFields.some(it => (
        it.props?.isSpecialAgeFrameField
    ));

    var columns = SmartArray([
        ( showSequenceNumber && (
            { pointer: '/sequenceNumber', label: translate('ID No.') }
        )),
        ( showOnlineId && (
            { pointer: '/onlineId', label: translate('Online ID Code') }
        )),
        ...customColumns,
        ( (!commentFieldIsSensitive || canAccessSensitive) && (
            { pointer: '/scientific/state/comment', label: translate('Comment') }
        )),
        // NOTE: virtual column calculated by the api
        ( hasDateOfBirthField && (
            { pointer: '/_testingAge', label: translate('T-Age') }
        )),
    ]);

    var prefix = translate('Subject');
    return columns.map(it => ({
        pointer: `/_subject${it.pointer}`,
        label: `${prefix}: ${it.label}`,
    }));
}
