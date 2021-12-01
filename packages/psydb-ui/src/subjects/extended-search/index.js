import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    Fields
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
            <Fields.DateOnlyServerSide
                label='Start'
                dataXPath='$.start'
            />
            <Fields.SaneString
                label='Name'
                dataXPath='$.name'
            />
        </>
    );
}

export default ExtendedSearch;
