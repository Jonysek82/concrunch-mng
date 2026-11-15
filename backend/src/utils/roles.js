// Role uživatelů a skupiny rolí pro autorizaci v API.
// Seznam rolí je jen tady, ostatní soubory ho importují.
const ROLES = Object.freeze({
  VISITOR: 'visitor',
  ORGANIZER: 'organizer',
  ADMIN: 'admin'
});

const ROLE_LIST = Object.freeze(Object.values(ROLES));

// Kdo smí co:
// - veřejné GET endpointy: kdokoli, i bez přihlášení
// - STAFF: správa obsahu (akce, účinkující, obchody, aktuality, tagy)
// - ADMIN_ONLY: mazání obsahu, správa uživatelů a schvalování organizátorů
const STAFF = Object.freeze([ROLES.ORGANIZER, ROLES.ADMIN]);
const ADMIN_ONLY = Object.freeze([ROLES.ADMIN]);

const isValidRole = (role) => ROLE_LIST.includes(role);

module.exports = { ROLES, ROLE_LIST, STAFF, ADMIN_ONLY, isValidRole };
