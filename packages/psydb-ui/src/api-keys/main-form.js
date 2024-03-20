import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

const Component = (ps) => {
    var {
        type,
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    var translate = useUITranslation();
    var permissions = usePermissions();

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        { (type === 'create' && permissions.isRoot()) && (
                            <Fields.ForeignId
                                label={ translate('Account')}
                                dataXPath='$.personnelId'
                                collection='personnel'
                            />
                        )}
                        <Fields.SaneString
                            label={ translate('Label')}
                            dataXPath='$.props.label'
                        />
                        { type === 'edit' && (
                            <Fields.DefaultBool
                                label={ translate('Enabled')}
                                dataXPath='$.props.isEnabled'
                            />
                        )}
                        <Button type='submit'>
                            { translate('Save')}
                        </Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const createDefaults = (options) => {
    var { personnelId } = options;
    return {
        ...(personnelId && { personnelId }),
        props: {
            label: '',
            isEnabled: true,
            permissions: {}
        }
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
