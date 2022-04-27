import React from 'react';
import classnames from 'classnames';
// FIXME: move to layout
const FormBox = ({
    title,
    children,
    extraClassName,
    titleClassName,
}) => {
    var className = classnames([
        'border p-3 bg-light',
        extraClassName
    ])
    return (
        <div className={ className }>
            <h5 className={ titleClassName }>
                { title }
            </h5>
            <hr />
            { children }
        </div>

    )
}

export default FormBox;
