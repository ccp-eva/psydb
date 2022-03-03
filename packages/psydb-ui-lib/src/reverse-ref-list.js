import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { collections as collectionEnum } from '@mpieva/psydb-schema-enums';

export const ReverseRefList = (ps) => {
    var { reverseRefs } = ps;

    var groupedReverseRefs = groupBy({
        items: reverseRefs,
        byProp: 'collection',
    });

    return (
        Object.keys(groupedReverseRefs).map(collection => {
            var collectionLabel = collectionEnum.mapping[collection];
            var collectionReverseRefs = groupedReverseRefs[collection];
            return (
                <div key={ collection }>
                    <header className='pb-1 mt-3'>
                        <b>{ collectionLabel }</b>
                    </header>
                    <div className='pl-3'>
                        { collectionReverseRefs.map(it => {
                            var { type, _id, _recordLabel } = it;
                            var url = (
                                type
                                ? `#/${collection}/${type}/${_id}`
                                : `#/${collection}/${_id}`
                            )

                            return (
                                <div key={ _id }>
                                    <a href={ url } target='_blank'>
                                        { _recordLabel }
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })
    );
}
