import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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
    var { reverseRefs, shouldInlineItems = false } = ps;
    var translate = useUITranslation();

    var groupedReverseRefs = groupBy({
        items: reverseRefs,
        byProp: 'collection',
    });

    var ItemWrapper = (
        shouldInlineItems
        ? ({ index, ...pass }) => (
            <span
                { ...(
                    index !== 0
                    ?  {
                        className: 'd-inline-block ml-2 pl-2',
                        style: { borderLeft: '1px solid black' }
                    }
                    : { className: 'd-inline-block' }
                )}
                { ...pass }
            />
        )
        : ({ index, ...pass }) => <div { ...pass } />
    )

    return (
        Object.keys(groupedReverseRefs).map(collection => {
            var collectionLabel = (
                collection === '_participation'
                ? translate('Study Participations')
                : enums.collections.mapping[collection]
            );
            var collectionReverseRefs = groupedReverseRefs[collection];
            return (
                <div key={ collection }>
                    <header className='pb-1 mt-3'>
                        <b>{ collectionLabel }</b>
                    </header>
                    <div className='pl-3'>
                        { collectionReverseRefs.map((it, ix) => {
                            var { type, _id, _recordLabel } = it;

                            // FIXME: fallback because pre-remove info
                            // currently does not return _recordLabel
                            _recordLabel = _recordLabel || _id;

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
                                <ItemWrapper index={ ix } key={ _id }>
                                    { renderedText }
                                </ItemWrapper>
                            )
                        })}
                    </div>
                </div>
            )
        })
    );
}
