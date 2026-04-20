import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ensureSeed, loadState, patchState, loadStateDecrypted, saveStateEncrypted } from '../lib/storage.js'
import { authorize } from '../lib/authorization.js'

const ClientContext = createContext(null)

export function ClientProvider({ children }) {
  const [state, setState] = useState(() => {
    const initial = ensureSeed()
    return initial ?? loadState()
  })

  // Persist whenever state changes (keep storage authoritative)
  // Use encrypted storage for security
  useEffect(() => {
    if (state) {
      saveStateEncrypted(state).catch((err) => {
        console.warn('[storage] encryption failed, falling back to unencrypted', err)
        patchState(state) // Fallback to unencrypted
      })
    }
  }, [state])

  const setSelectedClientId = useCallback((id) => {
    // Authorize access to client before allowing selection
    if (id) {
      try {
        authorize('mutate:client', { clientId: id })
      } catch (err) {
        console.warn('[auth] unauthorized client access:', err.message)
        return
      }
    }
    setState((prev) => ({ ...prev, selectedClientId: id ?? null }))
  }, [])

  const selectedClient = useMemo(
    () => state?.clients?.find((c) => c.id === state?.selectedClientId) ?? null,
    [state],
  )

  const value = useMemo(
    () => ({
      state,
      setState,
      clients: state?.clients ?? [],
      posts: state?.posts ?? [],
      campaigns: state?.campaigns ?? [],
      activity: state?.activity ?? [],
      selectedClientId: state?.selectedClientId ?? null,
      selectedClient,
      setSelectedClientId,
    }),
    [state, selectedClient, setSelectedClientId],
  )

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

export function useAppState() {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error('useAppState must be used within ClientProvider')
  return ctx
}
