import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';
import { CRT } from '@mpieva/psydb-ui-lib/data-viewers';
import withGeneralSettingsEditor from '../with-general-settings-editor';

const Form = (ps) => {
    var { record, send } = ps;
    var { state: {
        label,
        displayNameI18N = {},
        requiresTestingPermissions = false,
        commentFieldIsSensitive = false,
        showSequenceNumber = true,
        showOnlineId = true,
    }} = record;

    var initialValues = {
        label,
        displayNameI18N,
        requiresTestingPermissions,
        commentFieldIsSensitive,
        showSequenceNumber,
        showOnlineId,
    };
        
    var translate = useUITranslation();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        label={ translate('Display Name') }
                        dataXPath='$.label'
                        required
                    />
                    <Fields.SaneString
                        label={ translate('Display Name (DE)') }
                        dataXPath='$.displayNameI18N.de'
                    />
                    <Fields.DefaultBool
                        label={ translate('Requires Participation Permissions') }
                        dataXPath='$.requiresTestingPermissions'
                    />
                    <Fields.DefaultBool
                        label={ translate('Comment Field Requires Extra Permission') }
                        dataXPath='$.commentFieldIsSensitive'
                    />
                    
                    <Fields.DefaultBool
                        label={ translate('Show ID No.') }
                        dataXPath='$.showSequenceNumber'
                    />
                    <Fields.DefaultBool
                        label={ translate('Show Online ID Code') }
                        dataXPath='$.showOnlineId'
                    />

                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    )
}

const View = (ps) => {
    var { record } = ps;
    var { state: {
        label,
        requiresTestingPermissions = false,
        commentFieldIsSensitive = false,
        showSequenceNumber = true,
        showOnlineId = true,
    }} = record;

    var crtBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related : {},
        wLeft: 6,
    }

    return (
        <CRT { ...crtBag }>
            <CRT.Label />
            <CRT.DisplayNameI18N />
            <CRT.RequiresTestingPermissions />
            <CRT.CommentFieldIsSensitive />
            <CRT.ShowSequenceNumber />
            <CRT.ShowOnlineId />
        </CRT>
    )
}

const GeneralEditor = withGeneralSettingsEditor({
    title: 'General Settings',
    size: 'lg',

    View,
    Form,
})

export default GeneralEditor;
