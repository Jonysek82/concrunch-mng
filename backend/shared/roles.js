const ROLES = Object.freeze({
  VISITOR: 'visitor',
  ORGANIZER: 'organizer',
  ADMIN: 'admin'
});

const ROLE_LIST = Object.freeze(Object.values(ROLES));
const STAFF = Object.freeze([ROLES.ORGANIZER, ROLES.ADMIN]);
const ADMIN_ONLY = Object.freeze([ROLES.ADMIN]);

const isValidRole = (role) => ROLE_LIST.includes(role);

module.exports = { ROLES, ROLE_LIST, STAFF, ADMIN_ONLY, isValidRole };
