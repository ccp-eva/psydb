import React from 'react';
import {
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

export const Filters = (ps) => {
    var { schema } = ps;
    
    var customGdpr = getCustomFields(schema, 'gdpr');
    var customScientific = getCustomFields(schema, 'scientific');

    return (
        <FormBox title='Suchbedingungen'>
            <CustomFields
                dataXPath='$.customGdprFilters'
                fields={ customGdpr }
            />
            <CustomFields
                dataXPath='$.customScientificFilters'
                fields={ customScientific }
            />
            <Button type='submit'>
                Weiter
            </Button>
        </FormBox>
    )
}

const getCustomFields = (schema, subChannelKey) => (
    schema.properties[subChannelKey]
    .properties.state.properties.custom.properties
);

const CustomFields = (ps) => {
    var { dataXPath, fields } = ps;
    return (
        <>
            { Object.keys(fields).map(key => (
                <SearchFieldWrapper
                    key={ key }
                    dataXPath={ `${dataXPath}.${key}` }
                    schema={ fields[key] }
                />
            ))}
        </>
    );
}

const SearchFieldWrapper = (ps) => {
    var { dataXPath, schema } = ps;
    var { systemType, systemProps, title } = schema;

    var type = getSearchFieldType(systemType);
    //console.log({ systemType, type, systemProps, schema });
    
    if (!type) {
        return null;
    }

    var Component = Fields[type];
    return (
        <Component
            label={ title }
            dataXPath={ `${dataXPath}` }
            { ...systemProps }
        />
    );
}

const getSearchFieldType = (type) => {
    switch (type) {
        case 'SaneString':
        case 'BiologicalGender':
        case 'ExtBool':
            return type;

        case 'PhoneList':
        case 'EmailList':
            return 'SaneString';

        case 'HelperSetItemIdList':
        case 'HelperSetItemId':
            return 'HelperSetItemIdList';

        case 'ForeignIdList':
        case 'ForeignId':
            return 'ForeignIdList';

        default:
            return undefined;
    }
}
