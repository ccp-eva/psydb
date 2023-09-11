import React from 'react';
import classnames from 'classnames';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const FormBox = (ps) => {
    var {
        title,
        children,
        extraClassName,
        titleClassName,

        isRecordHidden
    } = ps;

    var translate = useUITranslation();

    var className = classnames([
        'border p-3 bg-light',
        extraClassName
    ]);

    return (
        <div className={ className }>
            <h5 className={ titleClassName }>
                { title }
                { isRecordHidden && (
                    <span className='d-inline-block text-muted ml-2'>
                        ({ translate('Hidden Record') })
                    </span>
                )}
            </h5>
            <hr />
            { children }
            
            { isRecordHidden && (
                <>
                    <hr />
                    <h5 className='text-muted'>
                        { translate('Hidden Record') }
                    </h5>
                </>
            )}
        </div>

    )
}

export default FormBox;
