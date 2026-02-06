import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { BigNav, Alert } from '@mpieva/psydb-ui-layout';

const RecordTypeNav = (ps) => {
    var { items, related } = ps;
    var [{ translate, language }] = useI18N();

    if (!items || items.length < 1) {
        return (
            <Alert variant='danger' className='mt-3'>
                <b>{ translate('No record types defined!') }</b>
            </Alert>
        );
    }
    var navItems = items.map(it => {
        if (related) {
            var type = it;
            var { label, displayNameI18N = {}} = related.crts[it].state;
        } else {
            var { type, label: manualLabel, state } = it;
            var { label, displayNameI18N = {}} = state;
        }
        return {
            label: manualLabel || displayNameI18N[language] || label,
            linkTo: `/${type}`
        }
    })
    return (
        <BigNav items={ navItems} />
    );
}

export default RecordTypeNav;
