import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    SplitPartitioned,
    PillNav
} from '@mpieva/psydb-ui-layout';


const SelectableStudies = (ps) => {
    var {
        subjectId,
        desiredTestInterval,
        selectedStudy,
        onSelect
    } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched, isTransmitting ] = useFetch((agent) => (
        agent.getAxios().post('/api/search-studies-testable-for-subject', {
            subjectId,
            desiredTestInterval
        })
    ), [ subjectId, desiredTestInterval.start, desiredTestInterval.end ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var items = fetched.data;

    return (
        <SplitPartitioned partitions={[ 2.3, 11 ]}>
            <b className='d-inline-block' style={{ paddingTop: '2px' }}>
                { translate('Possible Studies') }
            </b>
            { items.length > 0 ? (
                <PillNav
                    items={[
                        ...items.map(it => ({
                            key: it._id,
                            label: it.state.shorthand
                        }))
                    ]}
                    activeKey={ selectedStudy?._id }
                    onItemClick={ (id) => (
                        onSelect(items.find(it => it._id === id))
                    ) }
                />
            ) : (
                <i className='text-danger'>
                    { translate('No possible studies found.') }
                </i>
            )}
        </SplitPartitioned>
    )
}

export default SelectableStudies;
