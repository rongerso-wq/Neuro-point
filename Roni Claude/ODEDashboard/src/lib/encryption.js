/**
 * Encryption module for localStorage
 * Uses Web Crypto API (crypto.subtle) for AES-GCM encryption
 * Note: This protects against casual inspection; real security requires backend
 */

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const TAG_LENGTH = 128

// Derive a stable key from a password (using PBKDF2)
async function deriveKey(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const importedKey = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ])

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('odedashboard-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    importedKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

// Encrypt JSON data
export async function encryptData(data, password = 'default-key') {
  try {
    const key = await deriveKey(password)
    const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit nonce for GCM
    const encoder = new TextEncoder()
    const plaintext = encoder.encode(JSON.stringify(data))

    const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, plaintext)

    // Combine IV + ciphertext into single base64 string
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(ciphertext), iv.length)

    return btoa(String.fromCharCode.apply(null, combined))
  } catch (err) {
    console.warn('[encryption] encrypt failed', err)
    // Fallback: return unencrypted (non-fatal for demo)
    return JSON.stringify(data)
  }
}

// Decrypt JSON data
export async function decryptData(encrypted, password = 'default-key') {
  try {
    const key = await deriveKey(password)
    const combined = new Uint8Array(atob(encrypted).split('').map((c) => c.charCodeAt(0)))

    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)

    const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext)
    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(plaintext))
  } catch (err) {
    console.warn('[encryption] decrypt failed', err)
    // Fallback: treat as unencrypted JSON
    try {
      return JSON.parse(encrypted)
    } catch {
      return null
    }
  }
}

// For production: Use a backend key or environment variable
export function getEncryptionKey() {
  // In production, this should come from env or backend
  // For now, use a consistent in-app key (not great security, but better than plaintext)
  return 'odedashboard-secure-key'
}
