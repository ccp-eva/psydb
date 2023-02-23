import React from 'react';
import { useParams } from 'react-router'
import { useFetch } from '@mpieva/psydb-ui-hooks'
import { LoadingIndicator } from '@mpieva/psydb-ui-layout'

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

    var [didFetch, fetched ] = useFetch((agent) => (
        agent.fetchChannelHistory({
            channelId: id
        })
    ),[id]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <div className='d-flex'>
            <div className='w-50 flex-grow-1 pr-2'>
                { filterHistory({
                    history: fetched.data.scientific,
                    //path: 'scientific.state.custom.kigaId'
                }).map((it, ix) => (
                    <>
                        <b>{ it.event.timestamp } { it.event._id}</b>
                        <DiffViewer
                            key={ ix }
                            diff={ it.diff }
                            //onlyPath={ 'scientific.state.custom.kigaId' }
                        />
                    </>
                ))}
            </div>
            <div className='w-50 flex-grow-1 pl-2'>
                { filterHistory({
                    history: fetched.data.gdpr,
                    //path: 'scientific.state.custom.kigaId'
                }).map((it, ix) => (
                    <>
                        <b>{ it.event.timestamp } { it.event._id}</b>
                        <DiffViewer
                            key={ ix }
                            diff={ it.diff }
                            //onlyPath={ 'scientific.state.custom.kigaId' }
                        />
                    </>
                ))}
            </div>
        </div>
    )
}

var DiffViewer = (ps) => {
    var { diff, onlyPath } = ps;
    var items = filterDiff({ diff, path: onlyPath });

    return (
        <div>
            { items.map((it, ix) => {
                var Component = {
                    'E': DiffKindE,
                }[it.kind] || DiffKindFallback;

                return <Component key={ ix } diff={ it } />
            })}
        </div>
    )
}

var DiffKindE = (ps) => {
    var { diff } = ps;
    return (
        <pre className='bg-light p-3 mb-3 border'>
            { String(diff.lhs) } => { String(diff.rhs) }
        </pre>
    )
}

var DiffKindFallback = (ps) => {
    var { diff } = ps;
    return (
        <pre className='bg-light p-3 mb-3 border'>
            Fallback: { JSON.stringify(diff, null, 4) }
        </pre>
    )
}

export default History;
