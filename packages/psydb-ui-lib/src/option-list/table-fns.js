import React from 'react';
import { Pagination } from '@mpieva/psydb-ui-layout';
import QuickSearch from '../quick-search';
import ShowHiddenToggle from './show-hidden-toggle';

const TableFNs = (ps) => {
    var { tablefns, displayFieldData } = ps;
    var {
        filters, showHidden,
        offset, limit,
    } = tablefns.getProps();

    return (
        <div className='sticky-top border-bottom'>
            <div className='d-flex justify-content-between bg-light border-bottom'>
                <QuickSearch
                    target='optionlist'
                    filters={ filters }
                    displayFieldData={ displayFieldData }
                    onSubmit={ (bag) => {
                        tablefns.setFilters(bag.filters || {});
                    }}
                />
                <div className='pt-2 px-3'>
                    <ShowHiddenToggle
                        showHidden={ showHidden }
                        setShowHidden={ tablefns.setShowHidden }
                    />
                </div>
            </div>

            <Pagination
                { ...tablefns.getPagination() }
                showJump={ false }
            />
        </div>
    )
}

export default TableFNs;
