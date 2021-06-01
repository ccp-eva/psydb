import React, { useState, useEffect, useReducer } from 'react';
import { ArrowUpShort, ArrowDownShort, Plus, X } from 'react-bootstrap-icons';

import * as wrappers from './utility-components/wrappers';
import * as variants from './array-field-template-variants';

const ArrayFieldTemplate = (ps) => {
    var {
        schema
    } = ps;
    //console.log(ps);

    var Variant = variants[schema.systemType];
    if (!Variant) {
        Variant = variants.DefaultVariant
    }

    return (
        <Variant { ...ps } />
    )
}



export default ArrayFieldTemplate;
