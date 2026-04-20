/* ============================================================
   Tiny localStorage wrapper — single namespaced key
   All app state is one JSON blob: { clients, posts, campaigns, ... }
   Optional encryption via crypto.subtle (AES-GCM)
   ============================================================ */

import { SEED } from './seed.js'
import { encryptData, decryptData, getEncryptionKey } from './encryption.js'

const KEY = 'odedashboard.v1'
const ENCRYPTION_ENABLED = true // Set to false to disable encryption temporarily

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null

    // Try to parse as JSON first (backward compat with unencrypted data)
    try {
      return JSON.parse(raw)
    } catch {
      // If JSON parse fails, might be encrypted — return null and let init handle it
      return null
    }
  } catch {
    return null
  }
}

export async function loadStateDecrypted() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null

    // Try unencrypted first
    try {
      return JSON.parse(raw)
    } catch {
      // Try decrypted
      if (ENCRYPTION_ENABLED) {
        const decrypted = await decryptData(raw, getEncryptionKey())
        return decrypted
      }
      return null
    }
  } catch (e) {
    console.warn('[storage] load failed', e)
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    // quota or serialization error — non-fatal in demo
    console.warn('[storage] save failed', e)
  }
}

export async function saveStateEncrypted(state) {
  try {
    if (ENCRYPTION_ENABLED) {
      const encrypted = await encryptData(state, getEncryptionKey())
      localStorage.setItem(KEY, encrypted)
    } else {
      localStorage.setItem(KEY, JSON.stringify(state))
    }
  } catch (e) {
    console.warn('[storage] save encrypted failed', e)
  }
}

export function patchState(patch) {
  const current = loadState() ?? {}
  const next = { ...current, ...patch }
  saveState(next)
  return next
}

export function resetState() {
  localStorage.removeItem(KEY)
}

/** Initialize storage with seed data on first run. */
export function ensureSeed() {
  const existing = loadState()
  if (existing && existing.__seeded) return existing
  const seeded = { ...SEED, __seeded: true, __version: 1 }
  saveState(seeded)
  return seeded
}
