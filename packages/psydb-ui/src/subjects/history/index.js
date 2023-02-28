import React from 'react';
import * as datefns from 'date-fns';
import { useParams } from 'react-router'
import { useFetchAll } from '@mpieva/psydb-ui-hooks'
import { LoadingIndicator } from '@mpieva/psydb-ui-layout'
// XXX
import { Custom, StaticFields } from '@mpieva/psydb-ui-lib/src/diff-viewers/utility-components';

const filterDiff = (bag) => {
    var { diff, path } = bag;
    if (!path) {
        return diff.filter(diffItem => (
            !diffItem.path.join('.').includes('internals')
        ));
    }

    return diff.filter(diffItem => (
        diffItem.path.join('.').startsWith(path)
        && !diffItem.path.join('.').includes('internals')
    ))
}

const filterHistory = (bag) => {
    var { history, path } = bag;
    if (!path) {
        return history.filter(it => it.diff);
    }

    return (
        history.filter(historyItem => (
            historyItem.diff && filterDiff({
                diff: historyItem.diff, path
            }).length > 0
        ))
    )
}

const History = (ps) => {
    var { collection, recordType } = ps;
    var { id } = useParams();

    var [didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection, recordType
        }),
        history: agent.fetchChannelHistory({
            channelId: id
        })
    }),[ collection, recordType, id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var crtSettings = fetched.crtSettings;
    var history = fetched.history;

    return (
        <>
            <h3 className='border-bottom'>Proband:innen-Historie</h3>
            <div className='border p-3 bg-light'>
                <div className='d-flex'>
                    <div className='w-50 flex-grow-1 pr-2'>
                        <h5 className='mb-3'>Datenkanal: Standard</h5>
                        { filterHistory({
                            history: history.data.scientific,
                            //path: 'scientific.state.custom.kigaId'
                        }).map((it, ix) => (
                            <HistoryItem
                                key={ ix }
                                item={ it }
                                subChannelKey='scientific'
                                crtSettings={ crtSettings.data }
                                //onlyPath={ 'scientific.state.custom.kigaId' }
                            />
                        ))}
                    </div>
                    <div className='w-50 flex-grow-1 pl-2'>
                        <h5 className='mb-3'>Datenkanal: Datenschutz</h5>
                        { filterHistory({
                            history: history.data.gdpr,
                            //path: 'scientific.state.custom.kigaId'
                        }).map((it, ix) => (
                            <HistoryItem
                                key={ ix }
                                item={ it }
                                subChannelKey='gdpr'
                                crtSettings={ crtSettings.data }
                                //onlyPath={ 'scientific.state.custom.kigaId' }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

var HistoryItem = (ps) => {
    var { item, onlyPath, subChannelKey, crtSettings } = ps;
    var { event, diff, version, message } = item;
    return (
        <div className='bg-white p-3 mb-3 border'>
            <header className='mb-1 pb-1'>
                <div>
                    <b>{ datefns.format(
                        new Date(event.timestamp),
                        'dd.MM.yyyy HH:mm:ss'
                    ) }</b>
                <div>
                </div>
                    Versions-ID: { event._id }
                </div>
            </header>
            <DiffViewer
                diff={ diff }
                onlyPath={ onlyPath }
                subChannelKey={ subChannelKey }
                crtSettings={ crtSettings }
            />
        </div>
    )
}

var DiffViewer = (ps) => {
    var { diff, onlyPath, ...pass } = ps;
    var items = filterDiff({ diff, path: onlyPath });

    return (
        <div>
            { items.map((it, ix) => {
                var Component = {
                    'N': DiffKindN,
                    'E': DiffKindE,
                }[it.kind] || DiffKindFallback;

                return <Component key={ ix } diff={ it } { ...pass } />
            })}
        </div>
    )
}

var DiffKindN = (ps) => {
    var { diff, subChannelKey, crtSettings } = ps;
    return (
        <pre className='ml-4 mb-0 py-3 border-top'>
            <div>
                { diff.path.join('.') }
            </div>
            <div>
                { diff.rhs?.state?.custom ? (
                    <Custom
                        diffKind='N'
                        value={ diff.rhs.state.custom }
                        subChannelKey={ subChannelKey }
                        crtSettings={ crtSettings }
                    />
                ) : (
                    '+++' + JSON.stringify(diff.rhs, null, 4)
                )}
            </div>
        </pre>
    )
}

var DiffKindE = (ps) => {
    var { diff, subChannelKey, crtSettings } = ps;
    var pointer = '/' + diff.path.join('/');
    
    var { fieldDefinitions } = crtSettings;
    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );

    var definition = fields.find(it => (
        it.pointer === pointer
    ));

    var FieldComponent = StaticFields[fixSystemType(definition.type)];

    return (
        <pre className='ml-4 mb-0 p-3 border-top'>
            <header>
                <b>{ definition.displayName }</b>
            </header>
            <div>
                <div className='d-flex'>
                    <b className='text-danger'>---{' '}</b>
                    <div>
                        <FieldComponent
                            value={ diff.rhs }
                            props={ definition.props }
                        />
                    </div>
                </div>
                <div className='d-flex'>
                    <b className='text-success'>+++{' '}</b>
                    <div>
                        <FieldComponent
                            value={ diff.lhs }
                            props={ definition.props }
                        />
                    </div>
                </div>
            </div>
        </pre>
    )
}

var DiffKindFallback = (ps) => {
    var { diff } = ps;
    return (
        <pre className='ml-4 mb-0 p-3 border-top'>
            Fallback: { JSON.stringify(diff, null, 4) }
        </pre>
    )
}

const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneWithTypeList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};
export default History;
