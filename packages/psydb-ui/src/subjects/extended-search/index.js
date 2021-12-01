import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

const getCustomFields = (schema, subChannelKey) => (
    schema.properties[subChannelKey]
    .properties.state.properties.custom.properties
);

const ExtendedSearch = (ps) => {
    var {
        collection,
        recordType
    } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecordSchema({
            collection,
            recordType
        })
    ), [ collection, recordType ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var schema = fetched.data;
    var defaultValues = {}; // createDefaults({ schema })

    return (
        <FormBox title='Erweiterte Suche'>
            <DefaultForm
                onSubmit={ (formData) => { console.log(formData) }}
                initialValues={ defaultValues }
            >
                {(formikProps) => (
                    <FormBody schema={ schema } />
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormBody = (ps) => {
    var { schema } = ps;
    
    var customGdpr = getCustomFields(schema, 'gdpr');
    var customScientific = getCustomFields(schema, 'scientific');

    return (
        <>
            <CustomFields
                dataXPath='$gdpr.state.custom'
                fields={ customGdpr }
            />
            <CustomFields
                dataXPath='$scientific.state.custom'
                fields={ customScientific }
            />
            <Button type='submit'>
                Suchen
            </Button>
        </>
    )
}

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
    console.log({ systemType, type });
    
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

        //case 'HelperSetItemIdList':
        //case 'HelperSetItemId':
        //    return 'HelperSetItemIdList';

        case 'ForeignIdList':
        case 'ForeignId':
            return 'ForeignIdList';

        default:
            return undefined;
    }
}

export default ExtendedSearch;
