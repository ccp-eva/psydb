import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';

export const InfoTextMarkdown = (ps) => {
    var { dataXPath } = ps;
    var [{ translate }] = useI18N();
    return (
        <>
            <Fields.FullText
                label={ translate('Markdown') }
                dataXPath={ `${dataXPath}.markdown` }
                required={ true }
            />
        </>
    );
}

export const SubjectField = (ps) => {
    var { dataXPath, subjectCRT } = ps;
    var [{ translate }] = useI18N();
    var options = {};
    for (var it of subjectCRT.allCustomFields()) {
        options[it.pointer] = translate.fieldDefinition(it)
    }
    return (
        <>
            <Fields.GenericEnum
                label={ translate('Field') }
                dataXPath={ `${dataXPath}.pointer` }
                require={ true }
                options={ options }
            />
        </>
    );
}

export const ExtraField = (ps) => {
    var { dataXPath } = ps;
    var [{ translate }] = useI18N();
    return (
        <>
            <Fields.CustomFieldType
                label={ translate('Field Type') }
                dataXPath={ `${dataXPath}.systemType` }
                required={ true }
                only={[
                    'DefaultBool', 'SaneString',
                    'DateOnlyServerSide', 'Address'
                ]}
            />
            <Fields.SaneString
                label={ translate('Display Name') }
                dataXPath={ `${dataXPath}.displayName` }
                required={ true }
            />
        </>
    );
}

export const HR = (ps) => {
    var { dataXPath } = ps;
    var [{ translate }] = useI18N();
    return (
        <i className='text-muted'>
            { translate('No further settings available.') }
        </i>
    );
}
