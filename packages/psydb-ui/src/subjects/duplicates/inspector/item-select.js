import React from 'react';
import { GenericEnum } from '@mpieva/psydb-ui-form-controls';

const ItemSelect = (ps) => {
    var { items, value, onChange, disabledId } = ps;

    var options = {};
    for (var it of items) {
        options[it._id] = it._label;
    }
    return (
        <GenericEnum
            options={ options }
            value={ value }
            onChange={ onChange }
            disabledValues={[ disabledId ]}
        />
    )
}

export default ItemSelect;
