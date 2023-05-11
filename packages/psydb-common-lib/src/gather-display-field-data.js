'use strict';
var convertCRTRecordToSettings = require('./convert-crt-record-to-settings');
var CRTSettings = require('./crt-settings');

// TODO: should be renamed to gather "field data by pointer"

// TODO: non-custom fields
var gatherDisplayFieldData = ({
    customRecordTypeData
}) => {
    var crtSettings = convertCRTRecordToSettings(customRecordTypeData);
    var crt = CRTSettings({ data: crtSettings });

    return crt.availableDisplayFields();

    //var fieldData = [
    //    {
    //        key: 'ID',
    //        systemType: 'Id',
    //        dataPointer: '/_id', // FIXME
    //        displayName: 'ID',
    //    },
    //    ...crt.allStaticFields(),
    //    ...crt.allCustomFields().map(it => ({
    //        ...it, dataPointer: it.pointer // FIXME: compat
    //    }))
    //];

    //return fieldData;
};

module.exports = gatherDisplayFieldData;
