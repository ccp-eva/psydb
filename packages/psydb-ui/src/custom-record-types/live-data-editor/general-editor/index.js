import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';
import { CRT } from '@mpieva/psydb-ui-lib/data-viewers';
import withGeneralSettingsEditor from '../with-general-settings-editor';

const reservationTypes = {
    'inhouse': '_reservationType_inhouse',
    'away-team': '_reservationType_away-team',
    'no-reservation': '_reservationType_no-reservation',
}

const Form = (ps) => {
    var { record, send } = ps;
    var { collection, state: {
        label,
        displayNameI18N = {},
        enableLabTeams = true,
        enableSubjectSelectionSettings = true,
        reservationType,
    }} = record;

    var initialValues = {
        label,
        displayNameI18N,
        ...(collection === 'study' && {
            enableLabTeams,
            enableSubjectSelectionSettings,
        }),
        ...(collection === 'location' && {
            reservationType
        }),
    };

    var translate = useUITranslation();
    var uiSplit = [ 4, 8 ];

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        uiSplit={ uiSplit }
                        label={ translate('Display Name') }
                        dataXPath='$.label'
                        required
                    />
                    <Fields.SaneString
                        uiSplit={ uiSplit }
                        label={ translate('Display Name (DE)') }
                        dataXPath='$.displayNameI18N.de'
                    />
                    { collection === 'location' && (
                        <Fields.GenericEnum
                            uiSplit={ uiSplit }
                            label={ translate('Reservation Type') }
                            dataXPath='$.reservationType'
                            options={ translate.options(reservationTypes) }
                            required
                        />
                    )}
                    { collection === 'study' && (
                        <>
                            <Fields.DefaultBool
                                uiSplit={ uiSplit }
                                label={ translate('Enable Lab Teams') }
                                dataXPath='$.enableLabTeams'
                            />
                            <Fields.DefaultBool
                                uiSplit={ uiSplit }
                                label={ translate('Enable Subject Selection') }
                                dataXPath='$.enableSubjectSelectionSettings'
                            />
                        </>
                    )}
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
    var { collection } = record;

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
            
            { collection === 'study' && (
                <>
                    <CRT.EnableLabTeams />
                    <CRT.EnableSubjectSelectionSettings />
                </>
            )}
            { collection === 'location' && (
                <>
                    <CRT.ReservationType />
                </>
            )}
        </CRT>
    )
}

const GeneralEditor = withGeneralSettingsEditor({
    title: 'General Settings',
    size: 'lg',

    View,
    Form,
});

export default GeneralEditor;
