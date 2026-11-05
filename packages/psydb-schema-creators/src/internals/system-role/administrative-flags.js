'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    'canAllowLogin': WideBool(),
    'canSetPersonnelPassword': WideBool(),
    'canUseExtendedSearch': WideBool(),
    'canUseCSVExport': WideBool(),
    'canCreateReservationsWithinTheNext3Days': WideBool(),
    'canCreateExperimentsWithinTheNext3Days': WideBool(),
    'canViewStudyLabOpsSettings': WideBool(),
    'canViewStudyLabTeams': WideBool(),
    'canAccessSensitiveFields': WideBool(),
}
