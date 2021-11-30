import React from 'react';

import { List } from './list';

export const ExcludedStudies = (ps) => {
    var { records, onSelect } = ps;

    return (
        <div className='d-flex flex-column flex-grow'>
            <div className='px-3 pt-1' style={{ height: '65px' }}>
                <i className='text-muted'>
                    Die aktuelle Studie wird automatisch mit ausgeschlossen
                </i>
            </div>
            <div className='border bg-white flex-grow'>
                <List { ...({
                    records,
                    onSelect
                })} />
            </div>
        </div>
    )
}
