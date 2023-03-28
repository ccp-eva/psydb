import React from 'react';
import { BigNav, Alert } from '@mpieva/psydb-ui-layout';

const RecordTypeNav = ({ items }) => {
    if (!items || items.length < 1) {
        return (
            <Alert variant='danger' className='mt-3'>
                <b>Keine Datensatztypen definiert</b>
            </Alert>
        );
    }
    var navItems = items.map(it => ({
        label: it.label || it.state.label,
        linkTo: `/${it.type}`
    }))
    return (
        <BigNav items={ navItems} />
    );
}

export default RecordTypeNav;
