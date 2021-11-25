import React from 'react';
import classnames from 'classnames';

export const Pagination = (ps) => {
    var { total, totalLabel, extraClassName } = ps;

    var className = classnames([
        'bg-light pt-2 pb-2 pr-3 pl-3 d-flex align-items-center',
        extraClassName
    ]);

    return (
        <div className={ className }>
            <span style={{ width: '150px' }}>
                <b>{ totalLabel || 'Gesamt:' }</b> { total }
            </span>
        </div>
    );
}
