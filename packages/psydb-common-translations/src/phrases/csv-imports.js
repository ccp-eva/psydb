'use strict';
module.exports = [
    {
        en: 'CSV Imports',
        de: 'CSV-Importe'
    },
    {
        en: 'Subject Contact History Imports',
        de: 'Proband:innen-Kontakt-Importe'
    },
    {
        en: 'Participation Imports',
        de: 'Teilnahme-Importe'
    },
    {
        en: 'Subject Imports',
        de: 'Proband:innen-Importe'
    },
    {
        en: 'New Import',
        de: 'Neuer Import'
    },
    {
        en: 'Imported At',
        de: 'Importiert Am'
    },
    {
        en: 'Imported By',
        de: 'Importiert Von'
    },
    {
        en: 'Upload File',
        de: 'Datei Hochladen'
    },
    {
        en: 'CSV Import Details',
        de: 'CSV-Import-Details'
    },
    {
        en: 'Source File',
        de: 'Quell-Datei'
    },
    {
        en: 'Show Available Columns',
        de: 'Verfügbare Spalten Anzeigen',
    },
    {
        en: 'Hide Available Columns',
        de: 'Verfügbare Spalten Ausblenden',
    },
    {
        en: 'Treat each line as seperate participation',
        de: 'Jede Zeile als seperate Teilnahme behandeln',
    },
    {
        en: 'Ignoring ${count} lines as they already exist in database.',
        de: 'Ignoriere ${count} Zeilen, da sie bereits in der Datenbank existieren.',
    },
    {
        internal: '_csvColumnInfo_required',
        en: 'required',
        de: 'Pflichtfeld',
    },
    {
        internal: '_csvColumnInfo_optional',
        en: 'optional',
        de: 'optional',
    },
    {
        internal: '_csvColumnInfo_examples',
        en: 'Examples',
        de: 'Beispiele',
    },
    {
        internal: '_csvColumnInfo_experiment_date',
        en: 'Date of the appointment in the format YYYY-MM-DD.',
        de: 'Datum des Termins im Format JJJJ-MM-TT.',
    },
    {
        internal: '_csvColumnInfo_experiment_time',
        en: 'Start time of the appointment in the format HH:MM (24h).',
        de: 'Startzeit des Termins im Format HH:MM (24h).',
    },
    {
        internal: '_csvColumnInfo_experiment_locationId',
        en: 'ID No. of the location record, or one of the additional import IDs configured for the location type.',
        de: 'ID-Nr. des Location-Datensatzes, oder eine der für den Location-Typ konfigurierten zusätzlichen Import-IDs.',
    },
    {
        internal: '_csvColumnInfo_experiment_locationId_simple',
        en: 'ID No. of the location record.',
        de: 'ID-Nr. des Location-Datensatzes.',
    },
    {
        internal: '_csvColumnInfo_experiment_subjectId',
        en: 'ID No. of the subject record, its online ID, or one of the additional import IDs configured for the subject type.',
        de: 'ID-Nr. des Proband:innen-Datensatzes, dessen Online-ID, oder eine der für den Proband:innen-Typ konfigurierten zusätzlichen Import-IDs.',
    },
    {
        internal: '_csvColumnInfo_experiment_subjectId_simple',
        en: 'ID No. of the subject record or its online ID.',
        de: 'ID-Nr. des Proband:innen-Datensatzes oder dessen Online-ID.',
    },
    {
        internal: '_csvColumnInfo_experiment_experimenterId',
        en: 'ID No. or manual import ID of the staff member. For multiple experimenters use the columns experimenterIds[0], experimenterIds[1], ...',
        de: 'ID-Nr. oder manuelle Import-ID der Mitarbeiter:in. Für mehrere Experimenter:innen die Spalten experimenterIds[0], experimenterIds[1], ... verwenden.',
    },
    {
        internal: '_csvColumnInfo_experiment_experimenterId_simple',
        en: 'ID No. of the staff member. For multiple experimenters use the columns experimenterIds[0], experimenterIds[1], ...',
        de: 'ID-Nr. der Mitarbeiter:in. Für mehrere Experimenter:innen die Spalten experimenterIds[0], experimenterIds[1], ... verwenden.',
    },
    {
        internal: '_csvColumnInfo_experiment_comment',
        en: 'Comment on the participation of the subject in this line. Column and value may be omitted.',
        de: 'Kommentar zur Teilnahme der Proband:in in dieser Zeile. Spalte und Wert können weggelassen werden.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_subjectId',
        en: 'ID No. of the subject record or its online ID.',
        de: 'ID-Nr. des Proband:innen-Datensatzes oder dessen Online-ID.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_contactType',
        en: 'Type of contact: email or phone.',
        de: 'Art des Kontakts: email oder phone.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_date',
        en: 'Date of the contact in the format YYYY-MM-DD or DD.MM.YYYY.',
        de: 'Datum des Kontakts im Format JJJJ-MM-TT oder TT.MM.JJJJ.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_time',
        en: 'Time of the contact in the format HH:MM (24h). Defaults to 12:00.',
        de: 'Uhrzeit des Kontakts im Format HH:MM (24h). Standardwert ist 12:00.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_contactedBy',
        en: 'ID No. or manual import ID of the staff member who made the contact.',
        de: 'ID-Nr. oder manuelle Import-ID der Mitarbeiter:in, die den Kontakt durchgeführt hat.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_status',
        en: 'Status of the contact. Defaults to sent. Column and value may be omitted.',
        de: 'Status des Kontakts. Standardwert ist sent. Spalte und Wert können weggelassen werden.',
    },
    {
        internal: '_csvColumnInfo_contactHistory_comment',
        en: 'Comment on the contact. Column and value may be omitted.',
        de: 'Kommentar zum Kontakt. Spalte und Wert können weggelassen werden.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_SaneString',
        en: 'Single-line text.',
        de: 'Einzeiliger Text.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_FullText',
        en: 'Text. Line breaks are possible if the value is enclosed in double quotes.',
        de: 'Text. Zeilenumbrüche sind möglich, wenn der Wert in doppelte Anführungszeichen gesetzt wird.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_Integer',
        en: 'Whole number.',
        de: 'Ganze Zahl.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_DefaultBool',
        en: 'true or false.',
        de: 'true oder false.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_ExtBool',
        en: 'yes, no or unknown.',
        de: 'yes, no oder unknown.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_DateTime',
        en: 'Date and time in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ, UTC).',
        de: 'Datum und Uhrzeit im ISO-8601-Format (JJJJ-MM-TTTHH:MM:SS.sssZ, UTC).',
    },
    {
        internal: '_csvColumnInfo_fieldtype_DateOnlyServerSide',
        en: 'Date in the format YYYY-MM-DD or DD.MM.YYYY.',
        de: 'Datum im Format JJJJ-MM-TT oder TT.MM.JJJJ.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_HelperSetItemId',
        en: 'ID No. or label of an entry of the associated helper table.',
        de: 'ID-Nr. oder Bezeichnung eines Eintrags der zugehörigen Hilfs-Tabelle.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_HelperSetItemIdList',
        en: 'ID No. or label of an entry of the associated helper table. One value per column: ${csvkey}[0], ${csvkey}[1], ...',
        de: 'ID-Nr. oder Bezeichnung eines Eintrags der zugehörigen Hilfs-Tabelle. Ein Wert pro Spalte: ${csvkey}[0], ${csvkey}[1], ...',
    },
    {
        internal: '_csvColumnInfo_fieldtype_ForeignId',
        en: 'ID No. of the referenced record.',
        de: 'ID-Nr. des referenzierten Datensatzes.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_ForeignIdList',
        en: 'ID No. of the referenced record. One value per column: ${csvkey}[0], ${csvkey}[1], ...',
        de: 'ID-Nr. des referenzierten Datensatzes. Ein Wert pro Spalte: ${csvkey}[0], ${csvkey}[1], ...',
    },
    {
        internal: '_csvColumnInfo_fieldtype_BiologicalGender',
        en: 'male, female, other or unknown.',
        de: 'male, female, other oder unknown.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_Email',
        en: 'Email address.',
        de: 'E-Mail-Adresse.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_Phone',
        en: 'Phone number.',
        de: 'Telefonnummer.',
    },
    {
        internal: '_csvColumnInfo_fieldtype_PhoneList',
        en: 'Phone number. One value per column: ${csvkey}[0], ${csvkey}[1], ...',
        de: 'Telefonnummer. Ein Wert pro Spalte: ${csvkey}[0], ${csvkey}[1], ...',
    },
    {
        internal: '_csvColumnInfo_fieldtype_SaneStringList',
        en: 'Single-line text. One value per column: ${csvkey}[0], ${csvkey}[1], ...',
        de: 'Einzeiliger Text. Ein Wert pro Spalte: ${csvkey}[0], ${csvkey}[1], ...',
    },
    {
        internal: '_csvColumnInfo_fieldtype_URLStringList',
        en: 'URL. One value per column: ${csvkey}[0], ${csvkey}[1], ...',
        de: 'URL. Ein Wert pro Spalte: ${csvkey}[0], ${csvkey}[1], ...',
    },
    {
        internal: '_csvColumnInfo_fieldtype_unsupported',
        en: 'This field type cannot be imported via CSV at the moment.',
        de: 'Dieser Feldtyp kann derzeit nicht per CSV importiert werden.',
    },
]
