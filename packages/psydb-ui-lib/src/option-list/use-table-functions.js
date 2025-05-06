import { useRef, useState, useMemo } from 'react';
import {
    useSortReducer,
    usePaginationReducer
} from '@mpieva/psydb-ui-hooks';

const useTableFunctions = (bag = {}) => {
    var {
        defaultSort = {},
        defaultOffset = 0,
        defaultLimit = 50
    } = bag;
   
    var [ filters, setFilters ] = useState({});
    var filtersChanged = useRef(false);

    var [ showHidden, setShowHidden ] = useState(false);

    var sorter = useSortReducer({
        sortPath: defaultSort.path, sortDirection: defaultSort.direction
    });

    var pagination = usePaginationReducer({
        offset: defaultOffset, limit: defaultLimit
    });

    var fns = {};
    fns.getSorter = () => sorter;
    fns.getPagination = () => pagination;
    fns.setFilters = (...args) => {
        filtersChanged.current = true;
        setShowHidden(true);
        setFilters(...args);
    };

    fns.setShowHidden = setShowHidden;

    fns.getProps = () => ({
        filters,
        showHidden,

        sortPath: sorter.sortPath,
        sortDirection: sorter.sortDirection || 'asc',
        offset: filtersChanged.current === true ? 0 : pagination.offset,
        limit: pagination.limit,
    });

    fns.handleResponseExtra = (response) => {
        if (filtersChanged.current === true) {
            pagination.selectSpecificPage(0);
        }
        pagination.setTotal(response.data.data.recordsCount);
        filtersChanged.current = false;
    }

    return useMemo(() => (fns), [
        filters, showHidden,
        sorter.sortPath, sorter.sortDirection,
        pagination.offset, pagination.limit, pagination.total,
        pagination.page, pagination.maxPage, // FIXME: required?
    ]);
}

export default useTableFunctions;
