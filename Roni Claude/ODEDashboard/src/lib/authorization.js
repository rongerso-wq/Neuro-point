/**
 * Authorization module
 * Validates user permissions before state mutations
 * Currently implements single-user (agency owner) model
 * Will extend to RBAC when authentication is added
 */

const ROLES = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
}

const PERMISSIONS = {
  [ROLES.OWNER]: [
    'manage:clients',
    'create:posts',
    'edit:posts',
    'approve:posts',
    'publish:posts',
    'manage:campaigns',
    'manage:team',
    'view:reports',
  ],
  [ROLES.EDITOR]: [
    'create:posts',
    'edit:posts',
    'view:reports',
  ],
  [ROLES.VIEWER]: [
    'view:reports',
  ],
}

// Current user (mock — will be replaced with real auth)
let currentUser = {
  id: 'user-owner',
  name: 'Agency Owner',
  role: ROLES.OWNER,
  allowedClientIds: null, // null = all clients
}

export function getCurrentUser() {
  return currentUser
}

export function setCurrentUser(user) {
  currentUser = { ...currentUser, ...user }
}

// Check if user can perform action
export function canPerform(action) {
  const perms = PERMISSIONS[currentUser.role] || []
  return perms.includes(action)
}

// Check if user can access client
export function canAccessClient(clientId) {
  if (!clientId) return false
  // If null, user has access to all clients
  if (currentUser.allowedClientIds === null) return true
  // Otherwise, check if client is in allowed list
  return currentUser.allowedClientIds?.includes(clientId) ?? false
}

// Check if user can modify client
export function canModifyClient(clientId) {
  if (!canAccessClient(clientId)) return false
  return canPerform('manage:clients')
}

// Check if user can modify post
export function canModifyPost(post, clientId) {
  // For now, allow if user can access the client AND has edit permission
  if (!clientId || !canAccessClient(clientId)) return false
  return canPerform('edit:posts')
}

// Authorize state mutation — throws error if not allowed
export function authorize(action, context = {}) {
  const { clientId, targetUserId } = context

  // Owner can do anything
  if (currentUser.role === ROLES.OWNER) return true

  switch (action) {
    case 'mutate:client':
      if (!canModifyClient(clientId)) {
        throw new Error('Not authorized to modify this client')
      }
      break

    case 'mutate:post':
      if (!canModifyPost(context, clientId)) {
        throw new Error('Not authorized to modify posts for this client')
      }
      break

    case 'mutate:campaign':
      if (!canAccessClient(clientId)) {
        throw new Error('Not authorized to modify campaigns for this client')
      }
      break

    case 'manage:team':
      if (!canPerform('manage:team')) {
        throw new Error('Not authorized to manage team')
      }
      break

    default:
      throw new Error(`Unknown action: ${action}`)
  }

  return true
}

export { ROLES, PERMISSIONS }
