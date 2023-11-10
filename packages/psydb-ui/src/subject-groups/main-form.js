import React from 'react';
import { Pair, Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

const Component = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
        subjectType,
        enableSubjectTypeSelect,
    } = ps;

    var formFieldsBag = {
        related,
        permissions,
        subjectType,
        enableSubjectTypeSelect
    }

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                ajvErrorInstancePathPrefix='/payload'
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <FormFields
                            formikProps={ formikProps }
                            { ...formFieldsBag }
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var {
        formikProps,
        related,
        permissions,
        subjectType,
        enableSubjectTypeSelect
    } = ps;
    var { props: { locationType }} = formikProps.values['$'];

    return (
        <>
            { enableSubjectTypeSelect ? (
                <Fields.GenericTypeKey
                    label='Proband:innen-Typ'
                    dataXPath='$.subjectType'
                    collection='subject'
                    required
                />
            ) : (
                <Pair
                    label='Proband:innen-Typ'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { related.relatedCustomRecordTypes.subject[subjectType].state.label }
                </Pair>
            )}
            <Fields.GenericTypeKey
                label='Location-Typ'
                dataXPath='$.props.locationType'
                collection='location'
                required
            />
            <Fields.ForeignId
                label='Location'
                dataXPath='$.props.locationId'
                collection='location'
                recordType={ locationType }
                disabled={ !locationType }
                required
            />
            <Fields.SaneString
                label='Bezeichnung'
                dataXPath='$.props.name'
                required
            />
            <Fields.FullText
                label='Kommentar'
                dataXPath='$.props.comment'
            />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.props.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}

const createDefaults = (options) => {
    return {
        props: {
            name: '',
            comment: '',
            systemPermissions: {
                accessRightsByResearchGroup: [],
                isHidden: false,
            }
        }
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
