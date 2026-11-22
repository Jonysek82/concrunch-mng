// Pomocné funkce pro úpravu/přesun akce (BUC US4).
// Záměrně bez závislostí (mongoose, express-validator), aby šly snadno otestovat.

// Údaje, které smí organizátor ve formuláři „Upravit akci“ změnit.
// Ostatní pole (createdBy, cancellationReason, _id, časové značky…) se z požadavku ignorují.
const EDITABLE_EVENT_FIELDS = Object.freeze([
  'title',
  'description',
  'day',
  'startTime',
  'endTime',
  'location',
  'status',
  'performerIds',
  'tagIds'
]);

// Stavy, které jde nastavit úpravou. Zrušení akce má vlastní endpoint PATCH /:id/cancel.
const EDITABLE_EVENT_STATUSES = Object.freeze(['draft', 'published']);

// Vrátí jen povolená pole, která v těle požadavku opravdu přišla.
const pickEventChanges = (body = {}) => {
  const changes = {};
  for (const field of EDITABLE_EVENT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field) && body[field] !== undefined) {
      changes[field] = body[field];
    }
  }
  return changes;
};

// Spojí uložený čas akce se změnami – kontrola „konec po začátku“ se tak provede
// i když organizátor pošle jen část údajů (např. jen nový konec).
const mergeEventSchedule = (event, changes) => ({
  day: changes.day !== undefined ? changes.day : event.day,
  startTime: changes.startTime !== undefined ? changes.startTime : event.startTime,
  endTime: changes.endTime !== undefined ? changes.endTime : event.endTime
});

// Odstraní duplicitní ID (stejný účinkující zaškrtnutý dvakrát apod.).
const uniqueIds = (ids = []) => [...new Set(ids.map(String))];

module.exports = {
  EDITABLE_EVENT_FIELDS,
  EDITABLE_EVENT_STATUSES,
  pickEventChanges,
  mergeEventSchedule,
  uniqueIds
};
