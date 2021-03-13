// - check permissions
//     <- collection = unrestricted, record-restricted

// - fetch customTypes for that collection
// - create all schemas that can be in that collection
// - gather all fields that contain foreignKeys from the schema
//
// - fetch the records from db
//
// if fk values should be fetched
//     - iterate every record
//     - when record has a key that matches a foreign key path
//       add the value to a field specific list
// 
// for each fks that have values gathered fetch the
// related values from the target collection
