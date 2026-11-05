import React, { useState } from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

import { withField } from '@cdxoo/formik-utils';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import * as Options from '../common-options';
import getFieldValue from '../get-field-value';

export const ForeignId = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <MainTable { ...ps } />
            <RecordType { ...ps } />
            <Constraints { ...ps } />

            <Options.DisplayEmptyAsUnknownProp { ...ps } />

            <AddReferenceToTarget { ...ps } />
            <TargetReferenceField { ...ps } />
            <IsReadOnly { ...ps } />

            <Options.IsNullableProp { ...ps } />
        </>
    )
}

export const ForeignIdList = (ps) => {
    return (
        <>
            <MainTable { ...ps } />
            <RecordType { ...ps } />
            <Constraints { ...ps } />

            <AddReferenceToTarget { ...ps } />
            <TargetReferenceField { ...ps } />
            <IsReadOnly { ...ps } />

            <Options.MinItemsProp { ...ps } />
        </>
    )
}

const MainTable = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <Fields.GenericEnum
            label={ translate('Main Table') }
            dataXPath={ `${dataXPath}.props.collection` }
            enum={ enums.foreignIdFieldCollections }
            disabled={ !isUnrestricted }
            required
        />
    )
}

const RecordType = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    
    var [{ translate }] = useI18N();
    var { values } = useFormikContext();

    var { collection } = getFieldValue(values, `${dataXPath}.props`);

    return (
        <Fields.GenericTypeKey
            label={ translate('Record Type') }
            collection={ collection }
            dataXPath={ `${dataXPath}.props.recordType` }
            disabled={ !isUnrestricted || !collection }
            required
        />
    )
}

const Constraints = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    
    var [{ translate }] = useI18N();
    var { values } = useFormikContext();

    var { collection } = getFieldValue(values, `${dataXPath}.props`);

    return (
        <ForeignIdConstraints
            label={ translate('Constraint') }
            dataXPath={ `${dataXPath}.props.constraints` }
            disabled={ !isUnrestricted || !collection }
        />
    )
}

const ForeignIdConstraints = withField({ Control: (ps) => {
    var { label, dataXPath, disabled } = ps;
    var { values, setFieldValue } = useFormikContext();

    var constraints = getFieldValue(values, `${dataXPath}`)

    var [ internal, setInternal ] = useState(
        Object.keys(constraints).length > 0
        ? Object.keys(constraints).map(it => ({
            key: it,
            value: constraints[it]
        }))
        : [{ key: '', value: '' }]
    )
    
    console.log(constraints);
    
    var performUpdate = ({ index, nextKey, nextValue }) => {
        var nextInternal = [ ...internal ];

        if (nextKey !== undefined) {
            internal[index].key = nextKey;
        }
        if (nextValue !== undefined) {
            internal[index].value = nextValue;
        }

        var nextConstraints = nextInternal.reduce((acc, it) => ({
            ...acc,
            ...(String(it.key) !== '' && { [String(it.key)]: (
                it.value
            ) })
        }), {});
        
        setInternal(nextInternal);
        setFieldValue(`${dataXPath}`, nextConstraints);
    }

    return (
        <div>
            <b className='text-danger'>
                DANGER: Experimental feature!!
            </b>
            { internal.map((it, ix) => (
                <ConstraintPair
                    key={ ix }
                    disabled={ disabled }
                    index={ ix }
                    internal={ internal }
                    onChangeKey={(ev) => {
                        var next = ev.target.value;
                        next = next.replace(/\s/g, '_');
                        performUpdate({
                            index: ix,
                            nextKey: next
                        });
                        
                    }}
                    onChangeValue={(ev) => {
                        performUpdate({
                            index: ix,
                            nextValue: ev.target.value
                        });
                    }}
                />
            ))}
            { !disabled && (
                <a 
                    role='button'
                    onClick={ () => setInternal([
                        ...internal, { key: '', value: '' }
                    ])}
                >
                    <b>
                        + additional Constraint
                    </b>
                </a>
            )}
        </div>
    );
}})

const ConstraintPair = (ps) => {
    var { index, internal, onChangeKey, onChangeValue, disabled } = ps;

    return (
        <SplitPartitioned partitions={[1,1]}>
            <Controls.SaneString
                type='text'
                placeholder='Key'
                value={ internal[index].key }
                disabled={ disabled }
                onChange={ onChangeKey }
            />
            <Controls.SaneString
                type='text'
                value={ internal[index].value }
                placeholder='Value'
                disabled={ disabled }
                onChange={ onChangeValue }
            />
        </SplitPartitioned>
    )
}

const AddReferenceToTarget = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <Fields.DefaultBool
            label={ translate('Reference in Target') }
            dataXPath={ `${dataXPath}.props.addReferenceToTarget` }
            disabled={ !isUnrestricted }
        />
    )
}

const TargetReferenceField = (ps) => {
    var { record, dataXPath, isUnrestricted } = ps;
    
    var [{ translate }] = useI18N();
    var { values } = useFormikContext();
    
    var {
        collection,
        recordType,
        addReferenceToTarget
    } = getFieldValue(values, `${dataXPath}.props`);

    console.log(collection, recordType, addReferenceToTarget)
    
    return (
        <Fields.CRTFieldPointer
            label={ translate('Target Field') }
            collection={ collection }
            recordType={ recordType }
            filter={{
                // TODO: enable ForeignId make sure backend handles change
                // in 1:1 correctly i.e. remove references from
                // other targetting source records
                'type': 'ForeignIdList',
                'props.collection': record.collection,
                'props.recordType': record.type,
                'props.readOnly': true, // TODO
            }}
            dataXPath={ `${dataXPath}.props.targetReferenceField` }
            required
            disabled={
                !collection
                || !recordType
                || !addReferenceToTarget
            }
        />
    )
}

export const IsReadOnly = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <Fields.DefaultBool
            label={ translate('Read Only') }
            dataXPath={ `${dataXPath}.props.readOnly` }
            disabled={ !isUnrestricted }
            required
        />
    )
}
