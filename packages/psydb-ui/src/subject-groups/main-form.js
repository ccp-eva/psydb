import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

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
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
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

    var translate = useUITranslation();

    return (
        <>
            { enableSubjectTypeSelect ? (
                <Fields.GenericTypeKey
                    label={ translate('Subject Type')}
                    dataXPath='$.subjectType'
                    collection='subject'
                    required
                />
            ) : (
                <Pair
                    label={ translate('Subject Type')}
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { related.relatedCustomRecordTypes.subject[subjectType].state.label }
                </Pair>
            )}
            <Fields.GenericTypeKey
                label={ translate('Location Type')}
                dataXPath='$.props.locationType'
                collection='location'
                required
            />
            <Fields.ForeignId
                label={ translate('Location')}
                dataXPath='$.props.locationId'
                collection='location'
                recordType={ locationType }
                disabled={ !locationType }
                required
            />
            <Fields.SaneString
                label={ translate('_designation')}
                dataXPath='$.props.name'
                required
            />
            <Fields.FullText
                label={ translate('Comment')}
                dataXPath='$.props.comment'
            />
            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
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
