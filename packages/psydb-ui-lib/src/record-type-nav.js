import React from 'react';
import { BigNav } from '@mpieva/psydb-ui-layout';

const RecordTypeNav = ({ items }) => {
    var navItems = items.map(it => ({
        label: it.state.label,
        linkTo: `/${it.type}`
    }))
    return (
        <BigNav items={ navItems} />
    );
}

export default RecordTypeNav;
