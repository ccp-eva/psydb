import React from 'react';

const AgeFrameList = (ps) => {
    var {
        selectorRecord,
        ageFrameRecords,
        onEditAgeFrame,
        onRemoveAgeFrame,
        ...downstream
    } = ps;

    var { type: selectorType } = selectorRecord;

    if (ageFrameRecords.length < 1) {
        return (
            <div className='p-3 text-muted'>
                <b>Keine Altersfenster</b>
            </div>
        )
    }

    return (
        <>
            { foo }
            { /*ageFrameRecords.map((ageFrameRecord, index) => (
                <AgeFrameComponent key={ index } { ...({
                    selectorRecord,
                    ageFrameRecord,
                    onEdit: onEditAgeFrame,
                    onRemove: onRemoveAgeFrame,
                    ...downstream
                })} />
            ))*/}
        </>
    )
}

export default AgeFrameList;
