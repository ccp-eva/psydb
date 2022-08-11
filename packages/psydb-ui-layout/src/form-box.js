import React from 'react';
import classnames from 'classnames';
// FIXME: move to layout
const FormBox = ({
    title,
    children,
    extraClassName,
    titleClassName,

    isRecordHidden
}) => {
    var className = classnames([
        'border p-3 bg-light',
        extraClassName
    ])
    return (
        <div className={ className }>
            <h5 className={ titleClassName }>
                { title }
                { isRecordHidden && (
                    <span className='d-inline-block text-muted ml-2'>
                        (Datensatz ist Ausgeblendet)
                    </span>
                )}
            </h5>
            <hr />
            { children }
            
            { isRecordHidden && (
                <>
                    <hr />
                    <h5 className='text-muted'>
                        Datensatz ist Ausgeblendet
                    </h5>
                </>
            )}
        </div>

    )
}

export default FormBox;
