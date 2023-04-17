import React from 'react';

const DirtyAlert = (ps) => {
    return (
        <div className='text-danger small mt-3'>
            <header><b>Unfixierte Felder</b></header>
            <div>
                Datensatz-Typ enthält noch unfixierte Feldänderungen,
                bevor diese in den Live-Settings und in den Datensätzen
                verfügbar sind müssen sie vorher im Feld-Editor fixiert werden.
            </div>
        </div>
    );
}

export default DirtyAlert;
