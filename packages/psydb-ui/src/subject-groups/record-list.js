import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

import { entries, keyBy, groupBy } from '@mpieva/psydb-core-utils';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePermissions,
    useRevision,
    useModalReducer,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import {
    Pagination,
    LoadingIndicator,
    LinkButton,
    PageWrappers,
    Icons
} from '@mpieva/psydb-ui-layout';


import {
    QuickSearch,
} from '@mpieva/psydb-ui-lib';


export const RecordList = (ps) => {
    var { path, url } = useRouteMatch();
    var revision = useRevision();
    
    var translate = useUITranslation();
    var permissions = usePermissions();
    var enableNew = true;
    var canCreate = permissions.hasCollectionFlag('subjectGroup', 'write');

    var [ filters, setFilters ] = useURLSearchParamsB64();
    var { showHidden = false, ...realFilters } = filters;
    var setShowHidden = (next) => setFilters({
        ...filters, showHidden: next
    });

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.searchRecords({
            target: 'table',
            collection: 'subjectGroup',
            offset: 0,
            limit: 1000, // FIXME
            filters: realFilters,
            showHidden,
        })
    }, [ filters ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var {
        records,
        recordsCount,
        displayFieldData,
        related
    } = __fixRelated(fetched.data);

    var subjectGroupsById = keyBy({
        items: records,
        byProp: '_id'
    });

    var tree = groupBy({
        items: records,
        createKey: it => ([
            it.state.locationId,
            it.subjectType,
            it._id
        ].join(':::'))
    });

    tree = groupBy({
        items: entries(tree).map(([ key, items ]) => ({ key, items })),
        createKey: (it) => it.key.split(':::').slice(0, -1).join(':::')
    });
    
    tree = groupBy({
        items: entries(tree).map(([ key, items ]) => ({ key, items })),
        createKey: (it) => it.key.split(':::').slice(0, -1).join(':::')
    });

    tree = entries(tree).map(([ key, items ]) => ({ key, items }));

    return (
        <>
            { enableNew && canCreate && (
                <div className='mb-2'>
                    <LinkButton to={`${url}/new`}>
                        { translate('New Record') }
                    </LinkButton>
                </div>
            )}
            
            <div className='sticky-top border-bottom'>
                <div className='d-flex justify-content-between bg-light border-bottom align-items-end'>
                    <QuickSearch
                        filters={ filters }
                        displayFieldData={ displayFieldData }
                        onSubmit={ ({ filters }) => {
                            setFilters({
                                ...filters,
                                showHidden: (
                                    entries(filters || {})
                                    .filter(it => it[1])
                                    .length > 0
                                )
                            });
                        }}
                    />
                    {/*<div className='pb-2 px-3'>
                        <div
                            role='button'
                            className='d-flex align-items-center text-primary'
                            onClick={ () => setShowHidden(!showHidden) }
                        >
                            {
                                showHidden 
                                ? <Icons.CheckSquareFill />
                                : <Icons.Square />
                            }
                            <span className='ml-2'>
                                Ausgeblendete anzeigen
                            </span>
                        </div>
                    </div>*/}
                </div>
            </div>

            <Tree
                tree={ tree } level={ 2 }
                levelSettings={[
                    {
                        wrapperClassName: 'ml-1 pl-4',
                        wrapperStyle: { borderLeft: '3px solid #ccc' },
                        labelClassName: 'pb-1',
                    },
                    {
                        wrapperClassName: 'ml-1 pl-4',
                        wrapperStyle: { borderLeft: '3px solid #ccc' },
                        labelClassName: 'pb-1',
                        labelStyle: { fontWeight: 'bold' },
                    },
                    {
                        wrapperClassName: 'px-3 py-1',
                        labelClassName: 'pb-1',
                        labelStyle: {
                            fontWeight: 'bold', fontSize: '1.25rem'
                        }
                    }
                ]}

                baseURL={ url }
                subjectGroupsById={ subjectGroupsById }
                related={ related }
            />
        </>
    )
}

var withTree = ({ Component }) => (ps) => {
    var { tree, level, levelSettings = [], ...pass } = ps;
    
    var componentBag = { tree, level, ...pass, ...levelSettings[level] };
    return (
        tree.map(({ key, items }) => (
            <Component key={ key } { ...componentBag } itemKey={ key }>
                { level > 0 && (
                    <Tree
                        tree={ items } level={ level - 1 }
                        levelSettings={ levelSettings }
                        { ...pass }
                    />
                )}
            </Component>
        ))
    )
}

var Tree = withTree({ Component: (ps) => {
    var {
        tree,
        level,
        itemKey,
        wrapperClassName,
        wrapperStyle,
        labelClassName,
        labelStyle,

        baseURL,
        subjectGroupsById,
        related,

        children
    } = ps;

    var wrapperBag = { className: wrapperClassName, style: wrapperStyle };
    var labelBag = { className: labelClassName, style: labelStyle }

    var transform = it => ({ label: itemKey });
    if (level === 2) {
        transform = (it) => ({
            label: related.records.location[it.split(':::')[0]]._recordLabel
        });
    }
    if (level === 1) {
        transform = (it) => ({
            label: related.crts.subject[it.split(':::')[1]].state.label
        });
    }
    if (level === 0) {
        transform = (it) => {
            var subjectGroup = subjectGroupsById[it.split(':::')[2]];
            return {
                label: subjectGroup.state.name,
                url: `#${baseURL}/${subjectGroup._id}`
            }
        };
    }

    var { label, url } = transform(itemKey);

    return (
        <div { ...wrapperBag}>
            <div { ...labelBag }>
                { url ? (
                    <a href={ url }>{ label }</a>
                ) : label }
            </div>
            { children }
        </div>
    )
}})

