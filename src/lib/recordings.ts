import { useSyncExternalStore } from 'react'

// Stores parent-recorded voice clips (Blobs) per item id in IndexedDB, so a
// child hears mama/baba say the word instead of the synthesized voice.
const DB_NAME = 'kidlearn'
const STORE = 'recordings'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// A reactive set of item ids that currently have a recording.
let keys = new Set<string>()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

async function loadKeys(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAllKeys()
    req.onsuccess = () => {
      keys = new Set(req.result.map(String))
      emit()
    }
  } catch {
    /* IndexedDB unavailable — recordings simply won't be offered */
  }
}
if (typeof indexedDB !== 'undefined') void loadKeys()

export function hasRecording(id: string): boolean {
  return keys.has(id)
}

export async function getRecording(id: string): Promise<Blob | null> {
  try {
    const db = await openDB()
    return await new Promise((resolve) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id)
      req.onsuccess = () => resolve((req.result as Blob) ?? null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export async function saveRecording(id: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(blob, id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    keys = new Set(keys)
    keys.add(id)
    emit()
  } catch {
    /* ignore */
  }
}

export async function deleteRecording(id: string): Promise<void> {
  try {
    const db = await openDB()
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
    const next = new Set(keys)
    next.delete(id)
    keys = next
    emit()
  } catch {
    /* ignore */
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Reactively tells whether a recording exists for the given item id. */
export function useHasRecording(id: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => keys.has(id),
    () => false,
  )
}
