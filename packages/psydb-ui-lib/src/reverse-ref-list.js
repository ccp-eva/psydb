import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { collections as collectionEnum } from '@mpieva/psydb-schema-enums';

var collectionUILinks = {
    'subject': 'subjects',
    'researchGroup': 'research-groups',
    'location': 'locations',
    'study': 'studies',
    'personnel': 'personnel',
    'externalPerson': 'external-persons',
    'externalOrganization': 'external-organizations',
    'systemRole': 'system-roles',
    'experiment': 'experiments',

    '_participation': 'experiments',
}

export const ReverseRefList = (ps) => {
    var { reverseRefs } = ps;

    var groupedReverseRefs = groupBy({
        items: reverseRefs,
        byProp: 'collection',
    });

    return (
        Object.keys(groupedReverseRefs).map(collection => {
            var collectionLabel = (
                collection === '_participation'
                ? 'Studien-Teilnahmen'
                : collectionEnum.mapping[collection]
            );
            var collectionReverseRefs = groupedReverseRefs[collection];
            return (
                <div key={ collection }>
                    <header className='pb-1 mt-3'>
                        <b>{ collectionLabel }</b>
                    </header>
                    <div className='pl-3'>
                        { collectionReverseRefs.map(it => {
                            var { type, _id, _recordLabel } = it;
                            var clink = collectionUILinks[collection];

                            var renderedText = undefined;
                            if (clink) {
                                var url = (
                                    type
                                    ? `#/${clink}/${type}/${_id}`
                                    : `#/${clink}/${_id}`
                                );
                                renderedText = (
                                    <a href={ url } target='_blank'>
                                        { _recordLabel }
                                    </a>
                                );
                            }
                            else {
                                renderedText = _recordLabel;
                            }

                            return (
                                <div key={ _id }>
                                    { renderedText }
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })
    );
}
