/**
 * Authorization Roles
 */
const authRoles = {
  sadmin: ['admin', 'super-admin', 'supervisor'],
  admin: ['admin', 'supervisor'],
  superadmin: ['super-admin', 'supervisor'],
  supervisor: ['supervisor'],
  member: ['member'],
  memberadmin: ['member-admin'],
  staff: ['staff'],
  user: ['admin', 'super-admin', 'member', 'member-admin', 'staff', 'supervisor'],
  onlyGuest: [],
  allUsers: ['admin', 'super-admin', 'member', 'member-admin', 'staff', 'supervisor', ''],
};

export default authRoles;