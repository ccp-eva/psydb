import { hasOnlyOne } from '@mpieva/psydb-core-utils';

const maybeAutoSelect = (bag) => {
    var { selectables } = bag;

    if (hasOnlyOne(selectables)) {
        return [ selectables[0], selectables ];
    }
    else {
        return [ undefined, selectables ]
    }
}

export default maybeAutoSelect;
