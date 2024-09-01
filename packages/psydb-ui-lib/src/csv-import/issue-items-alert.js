import React from 'react';
import { entries, groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Alert } from '@mpieva/psydb-ui-layout';

const IssueItemsAlert = (ps) => {
    var { invalid, demapping = {}} = ps;

    return (
        <Alert variant='danger'>
            <InvalidItemList
                items={ invalid }
                demapping={ demapping }
            />
        </Alert>
    )
}

const InvalidItemList = (ps) => {
    var { style, className, items, demapping } = ps;
    var translate = useUITranslation();

    return (
        <div style={ style } className={ className }>
            <b>{ 'Invalid Rows' }</b>
            <div className='d-flex flex-column gapy-2'>
                { items.map((it, ix) => {
                    var bag = { key: ix, item: it, demapping };
                    return (it.replacementErrors ? (
                        <RefIssueItem { ...bag } />
                    ) : (
                        <DataIssueItem { ...bag } />
                    ))
                })}
            </div>
        </div>
    )
}

const CSVLine = (ps) => {
    var { values } = ps;
    return (
        <span>{
            JSON.stringify(values)
            .replace(/(^\[|\]$)/g, '')
            .replace(/","/g, '", "')
        }</span>
    )
}

const IssueItemWrapper = (ps) => {
    var { index, demapping, children } = ps;
    return (
        <div className='d-flex'>
            <b style={{ display: 'block', minWidth: '70px' }}>
                Line { index + 1 }
            </b>
            <div className='flex-grow-1'>
                { children }
            </div>
        </div>
    )
}

const RefIssueItem = (ps) => {
    var { item, demapping } = ps;
    var { index, csvLine, replacementErrors } = item;
    
    return (
        <IssueItemWrapper index={ index }>
            <CSVLine values={ csvLine } />
            <div>
                { replacementErrors.map((it, ix) => (
                    <ReplacementError
                        key={ ix } error={ it } demapping={ demapping }
                    />
                ))}
            </div>
        </IssueItemWrapper>
    )
}

const DataIssueItem = (ps) => {
    var { item, demapping } = ps;
    var { index, csvLine, validationErrors } = item
    return (
        <IssueItemWrapper index={ index }>
            <CSVLine values={ csvLine } />
            <div>
                { validationErrors.map((it, ix) => (
                    <ValidationError
                        key={ ix } error={ it } demapping={ demapping }
                    />
                ))}
            </div>
        </IssueItemWrapper>
    )
}

/*var demapping = {
    //date: [{ key: 'date', type: 'scalar' }],
    //time: [{ key: 'time', type: 'scalar' }],
    //subject: [{ key: 'subjectData', type: 'array' }, { key: 'subjectId', type: 'scalar' }],
}*/

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

    // XXX
    if (matchCounts.length < 1) {
        return [ dataPath ];
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
    var { error, demapping } = ps;
    var { dataPath, keyword, params, message } = error;
    
    console.log({ error });

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
    else if (keyword === 'additionalProperties') {
        var { additionalProperty } = params;
        var cols = demap({ dataPath: additionalProperty, demapping });
        return cols.map(it => (
            <div><b>{' - '}"{ it }" is unknown</b></div>
        ))
    }
    else {
        var cols = demap({ dataPath, demapping });
        return cols.map(it => (
            <div><b>{' - '}"{ it }" { message }</b></div>
        ))
    }
}

var ReplacementError = (ps) => {
    var { error, demapping } = ps;
    var { matchingItems, mapping } = error;
    var { csvColumn, value } = mapping;
    
    var cols = demap({ dataPath: csvColumn, demapping });

    return cols.map(it => (
        <div><b>
            {' - '}"{ it }" reference value "{ value }"
            {' '}
            { matchingItems.length === 0 ? (
                'did not match any database record'
            ) : (
                'must match exactly one database record'
            )}
        </b></div>
    ))
}
export default IssueItemsAlert;
