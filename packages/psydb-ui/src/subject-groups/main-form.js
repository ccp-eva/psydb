import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
    withFieldArray,
    withField,
    useFormikContext,
} from '@mpieva/psydb-ui-lib';

import { useFetch } from '@mpieva/psydb-ui-hooks';

export const MainForm = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <FormFields
                            related={ related }
                            permissions={ permissions }
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    return (
        <>
            <Fields.SaneString
                label='Name'
                dataXPath='$.name'
                required
            />
            <Fields.ForeignId
                label='Forschungsgruppe'
                dataXPath='$.researchGroupId'
                collection='researchGroup'
                required
            />
            <SubjectsForTypeList
                dataXPath='$.subjectsForType'
                label='Probanden'
                { ...ps }
            />
        </>
    );
}

const SubjectsForType = withField({
    Control: (ps) => {
        var {
            dataXPath,
            formikField,
            formikMeta,
            formikForm,

            disabled,
        } = ps;

        var { value = {} } = formikField;
        var { subjectType } = value;
        
        return (
            <>
                <CRTPicker
                    dataXPath={ `${dataXPath}.subjectType` }
                    label='Probanden-Typ'
                    collection='subject'
                />
                <Fields.ForeignIdList
                    dataXPath={ `${dataXPath}.subjectIds` }
                    label='Probanden'
                    collection='subject'
                    recordType={ subjectType }
                    disabled={ !subjectType }
                />
            </>
        )
    }
});

const SubjectsForTypeList = withFieldArray({
    FieldComponent: SubjectsForType,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
});


//TODO make actal picker
const CRTPicker = (ps) => {
    var { collection, ...pass } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection })
    ), [ collection ]);

    if (!didFetch) {
        return null;
    }

    var options = fetched.data.reduce((acc, it) => ({
        ...acc,
        [it.type]: it.label
    }), {});

    return (
        <Fields.GenericEnum { ...pass } options={ options } />
    )
}
