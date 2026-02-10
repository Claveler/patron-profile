import { useRef, useState, useCallback } from 'react'
import {
  patrons,
  patronRelationships,
  HOUSEHOLDS,
  HOUSEHOLD_MEMBERS,
} from '../data/patrons'

const MAX_STACK = 20

// Deep-clone a plain array of objects (one level deep — sufficient for our flat records)
const cloneArray = (arr) => arr.map(item => ({ ...item }))

// Capture a full snapshot of the four mutable data structures
const captureState = () => ({
  patronRelationships: cloneArray(patronRelationships),
  HOUSEHOLDS: cloneArray(HOUSEHOLDS),
  HOUSEHOLD_MEMBERS: cloneArray(HOUSEHOLD_MEMBERS),
  householdIdMap: Object.fromEntries(
    patrons.map(p => [p.id, p.householdId ?? null])
  ),
})

// Restore a snapshot by mutating the module-scope arrays in-place
const restoreState = (snap) => {
  patronRelationships.length = 0
  patronRelationships.push(...snap.patronRelationships)

  HOUSEHOLDS.length = 0
  HOUSEHOLDS.push(...snap.HOUSEHOLDS)

  HOUSEHOLD_MEMBERS.length = 0
  HOUSEHOLD_MEMBERS.push(...snap.HOUSEHOLD_MEMBERS)

  Object.entries(snap.householdIdMap).forEach(([id, hhId]) => {
    const p = patrons.find(patron => patron.id === id)
    if (p) p.householdId = hhId
  })
}

export function useRelationshipUndo() {
  const undoStack = useRef([])
  const redoStack = useRef([])
  // Counter to trigger re-renders when stack sizes change
  const [, setTick] = useState(0)
  const tick = () => setTick(t => t + 1)

  // Snapshot current state onto the undo stack (call BEFORE a mutation)
  const snapshot = useCallback(() => {
    undoStack.current.push(captureState())
    if (undoStack.current.length > MAX_STACK) {
      undoStack.current.shift()
    }
    // Any new action invalidates the redo history
    redoStack.current.length = 0
    tick()
  }, [])

  // Undo: save current state to redo stack, restore previous from undo stack
  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return
    redoStack.current.push(captureState())
    const prev = undoStack.current.pop()
    restoreState(prev)
    tick()
  }, [])

  // Redo: save current state to undo stack, restore next from redo stack
  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return
    undoStack.current.push(captureState())
    const next = redoStack.current.pop()
    restoreState(next)
    tick()
  }, [])

  // Clear both stacks (e.g., on patron navigation)
  const clearHistory = useCallback(() => {
    undoStack.current.length = 0
    redoStack.current.length = 0
    tick()
  }, [])

  return {
    snapshot,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    clearHistory,
  }
}
