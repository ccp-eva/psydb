import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { List } from './list';

export const ExcludedStudies = (ps) => {
    var { records, onSelect } = ps;
    
    var translate = useUITranslation();

    return (
        <div className='d-flex flex-column flex-grow'>
            <div className='px-3 pt-1' style={{ height: '65px' }}>
                <i className='text-muted'>
                    { translate('The current study is excluded automatically.') }
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
