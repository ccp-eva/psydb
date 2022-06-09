// FIXME: moved
import intervalfns from '@mpieva/psydb-date-interval-fns';

const formatInterval = (...args) => (
    intervalfns.format(...args)
);

export default formatInterval;
