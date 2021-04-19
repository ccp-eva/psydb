import React, { useState, useEffect } from 'react';

import {
    Form
} from 'react-bootstrap';

import withFormDecorations from './with-form-decorations';

const ForeignIdWidget = (ps) => {
    const {
        schema,
        formContext
    } = ps;

    console.log(formContext);
    return (
        <div>
            FOO
        </div>
    );
}

const WrappedForeignIdWidget = withFormDecorations(ForeignIdWidget);
export default WrappedForeignIdWidget;
