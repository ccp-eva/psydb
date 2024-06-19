import React from 'react';
import { entries, groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    Alert,
} from '@mpieva/psydb-ui-layout';

const IssueItemsAlert = (ps) => {
    var { invalid = [], unresolved = [] } = ps;

    return (
        <Alert variant='danger'>
            { invalid.length > 0 && (
                <InvalidItemList items={ invalid } />
            )}
            { unresolved.length > 0 && (
                <b>refIssueItems</b>
            )}
        </Alert>
    )
}

const InvalidItemList = (ps) => {
    var { style, className, items } = ps;
    var translate = useUITranslation();

    return (
        <div style={ style } className={ className }>
            <b>{ 'Invalid Rows' }</b>
            <div className='d-flex flex-column gapy-2'>
                { items.map((it, ix) => (
                    <InvalidItem key={ ix } item={ it } />
                ))}
            </div>
        </div>
    )
}

const InvalidItem = (ps) => {
    var { item } = ps;
    var { index, csvLine, validationErrors } = item
    return (
        <div className='d-flex'>
            <b style={{ display: 'block', minWidth: '70px' }}>Line { index + 1 }</b>
            <div className='flex-grow-1'>
                <span>{
                    JSON.stringify(csvLine)
                    .replace(/(^\[|\]$)/g, '')
                    .replace(/","/g, '", "')
                }</span>
                <div>
                    { validationErrors.map((it, ix) => (
                        <ValidationError key={ ix} error={ it } />
                    ))}
                </div>
            </div>
        </div>
    )
}

var demapping = {
    year: [{ key: 'year', type: 'scalar' }],
    month: [{ key: 'month', type: 'scalar' }],
    day: [{ key: 'day', type: 'scalar' }],
    participant: [{ key: 'subjectData', type: 'array' }, { key: 'subjectId', type: 'scalar' }],
    role: [{ key: 'subjectData', type: 'array' }, { key: 'role', type: 'scalar' }],
    experiment_name: [{ key: 'experimentName', type: 'scalar' }],
    room_or_enclosure: [{ key: 'roomOrEnclosure', type: 'scalar' }],
}

var demap = ({ dataPath, demapping }) => {
    if (dataPath[0] === '.') {
        dataPath = dataPath.substr(1);
    }
    var matchCounts = [];
    for (var [ col, demapPath ] of entries(demapping)) {
        var matchCount = 0;
        var dataPathTokens = dataPath.split('.');
        for (var demapToken of demapPath) {
            if (demapToken.type === 'array') {
                // NOTE: ajv does some wierd path stuff with array
                // i.e. uses subjectData[0]
                //var baseToken = dataPathTokens.shift();
                //var indexToken = dataPathTokens.shift();
                //if (baseToken === demapToken.key) {
                //    matchCount += 1;
                //}
                //else {
                //    break;
                //}
                var aryToken = dataPathTokens.shift();
                if (new RegExp(`^${demapToken.key}(\\[\\d+\\])?$`).test(aryToken)) {
                    matchCount += 1;
                }
                else {
                    break;
                }
            }
            else {
                var token = dataPathTokens.shift()
                if (token === demapToken.key) {
                    matchCount += 1
                }
                else {
                    break;
                }
            }
        }
        if (matchCount > 0) {
            matchCounts.push({ col, count: matchCount });
        }
    }

    var grouped = groupBy({
        items: matchCounts,
        byProp: 'count'
    });

    var max = (
        Object.values(grouped)
        .sort((a, b) => ( a[0].count < b[0].count ? 1 :-1 ))
        .shift()
    );

    return max.map(it => it.col);
}

var ValidationError = (ps) => {
    var { error } = ps;
    var { dataPath, keyword, params, message } = error;
    if (keyword === 'required') {
        var { missingProperty } = params;
        dataPath = (
            dataPath
            ? `${dataPath}.${missingProperty}`
            : missingProperty
        );
        var cols = demap({ dataPath, demapping });
        return cols.map(it => (
            <div><b>{' - '}"{ it }" is required</b></div>
        ))
    }
    else {
        var cols = demap({ dataPath, demapping });
        return cols.map(it => (
            <div><b>{' - '}"{ it }" { message }</b></div>
        ))
    }
}

export default IssueItemsAlert;
