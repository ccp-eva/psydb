import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { BigNav, Alert } from '@mpieva/psydb-ui-layout';

const RecordTypeNav = (ps) => {
    var { items } = ps;
    var [ language ] = useUILanguage();

    if (!items || items.length < 1) {
        return (
            <Alert variant='danger' className='mt-3'>
                <b>Keine Datensatztypen definiert</b>
            </Alert>
        );
    }
    var navItems = items.map(it => {
        var { type, label: manualLabel, state } = it;
        var { label, displayNameI18N = {}} = state;
        return {
            label: manualLabel || displayNameI18N[language] || label,
            linkTo: `/${it.type}`
        }
    })
    return (
        <BigNav items={ navItems} />
    );
}

export default RecordTypeNav;
