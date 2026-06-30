import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from './TreeStore'
import type { TreeItem } from './TreeStore'

const fixtures: TreeItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

describe('TreeStore', () => {
  let store: TreeStore

  beforeEach(() => {
    store = new TreeStore(fixtures.map((item) => ({ ...item })))
  })

  // ─── getAll ───────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns all items', () => {
      expect(store.getAll()).toHaveLength(8)
    })

    it('preserves original order', () => {
      const ids = store.getAll().map((i) => i.id)
      expect(ids).toEqual([1, '91064cee', 3, 4, 5, 6, 7, 8])
    })
  })

  // ─── getItem ──────────────────────────────────────────────────────────────

  describe('getItem', () => {
    it('returns item by numeric id', () => {
      expect(store.getItem(1)?.label).toBe('Айтем 1')
    })

    it('returns item by string id', () => {
      expect(store.getItem('91064cee')?.label).toBe('Айтем 2')
    })

    it('returns undefined for non-existent id', () => {
      expect(store.getItem(999)).toBeUndefined()
    })
  })

  // ─── getChildren ──────────────────────────────────────────────────────────

  describe('getChildren', () => {
    it('returns direct children only', () => {
      const ids = store.getChildren(1).map((c) => c.id)
      expect(ids).toHaveLength(2)
      expect(ids).toContain('91064cee')
      expect(ids).toContain(3)
    })

    it('does not include deeper descendants', () => {
      const ids = store.getChildren('91064cee').map((c) => c.id)
      expect(ids).toHaveLength(3)
      expect(ids).not.toContain(7)
      expect(ids).not.toContain(8)
    })

    it('returns empty array for leaf node', () => {
      expect(store.getChildren(7)).toEqual([])
    })

    it('returns empty array for non-existent id', () => {
      expect(store.getChildren(999)).toEqual([])
    })
  })

  // ─── getAllChildren ────────────────────────────────────────────────────────

  describe('getAllChildren', () => {
    it('returns all descendants of root', () => {
      const ids = store.getAllChildren(1).map((c) => c.id)
      expect(ids).toHaveLength(7)
      expect(ids).toContain('91064cee')
      expect(ids).toContain(3)
      expect(ids).toContain(4)
      expect(ids).toContain(5)
      expect(ids).toContain(6)
      expect(ids).toContain(7)
      expect(ids).toContain(8)
    })

    it('returns all descendants of mid-level node', () => {
      const ids = store.getAllChildren('91064cee').map((c) => c.id)
      expect(ids).toHaveLength(5)
      expect(ids).toContain(4)
      expect(ids).toContain(5)
      expect(ids).toContain(6)
      expect(ids).toContain(7)
      expect(ids).toContain(8)
    })

    it('returns empty array for leaf node', () => {
      expect(store.getAllChildren(7)).toEqual([])
    })

    it('returns empty array for non-existent id', () => {
      expect(store.getAllChildren(999)).toEqual([])
    })
  })

  // ─── getAllParents ─────────────────────────────────────────────────────────

  describe('getAllParents', () => {
    it('returns path from item to root in correct order', () => {
      const ids = store.getAllParents(7).map((p) => p.id)
      expect(ids).toEqual([7, 4, '91064cee', 1])
    })

    it('returns only the item itself for root node', () => {
      const parents = store.getAllParents(1)
      expect(parents).toHaveLength(1)
      expect(parents[0].id).toBe(1)
    })

    it('returns item and direct parent for depth-1 node', () => {
      const ids = store.getAllParents(3).map((p) => p.id)
      expect(ids).toEqual([3, 1])
    })

    it('returns empty array for non-existent id', () => {
      expect(store.getAllParents(999)).toEqual([])
    })
  })

  // ─── addItem ──────────────────────────────────────────────────────────────

  describe('addItem', () => {
    it('adds item to the store', () => {
      const newItem: TreeItem = { id: 9, parent: 7, label: 'Айтем 9' }
      store.addItem(newItem)
      expect(store.getItem(9)).toEqual(newItem)
      expect(store.getAll()).toHaveLength(9)
    })

    it('new item appears in parent\'s children', () => {
      store.addItem({ id: 9, parent: 7, label: 'Айтем 9' })
      expect(store.getChildren(7).map((c) => c.id)).toContain(9)
    })

    it('adds root item with parent null', () => {
      store.addItem({ id: 10, parent: null, label: 'Корень 2' })
      expect(store.getItem(10)?.parent).toBeNull()
      expect(store.getAll()).toHaveLength(9)
    })
  })

  // ─── removeItem ───────────────────────────────────────────────────────────

  describe('removeItem', () => {
    it('removes leaf item', () => {
      store.removeItem(3)
      expect(store.getItem(3)).toBeUndefined()
      expect(store.getAll()).toHaveLength(7)
    })

    it('removes item from parent\'s children list', () => {
      store.removeItem(3)
      expect(store.getChildren(1).map((c) => c.id)).not.toContain(3)
    })

    it('removes item and all its descendants', () => {
      store.removeItem('91064cee')
      expect(store.getAll()).toHaveLength(2) // only 1 and 3 remain
      expect(store.getItem(4)).toBeUndefined()
      expect(store.getItem(7)).toBeUndefined()
      expect(store.getItem(8)).toBeUndefined()
    })

    it('does nothing for non-existent id', () => {
      store.removeItem(999)
      expect(store.getAll()).toHaveLength(8)
    })
  })

  // ─── updateItem ───────────────────────────────────────────────────────────

  describe('updateItem', () => {
    it('updates item fields', () => {
      store.updateItem({ id: 3, parent: 1, label: 'Обновлено' })
      expect(store.getItem(3)?.label).toBe('Обновлено')
    })

    it('moves item to new parent', () => {
      store.updateItem({ id: 3, parent: '91064cee', label: 'Айтем 3' })
      expect(store.getChildren(1).map((c) => c.id)).not.toContain(3)
      expect(store.getChildren('91064cee').map((c) => c.id)).toContain(3)
    })

    it('updated item is accessible via getItem', () => {
      const updated: TreeItem = { id: 7, parent: 4, label: 'Новый лейбл', extra: true }
      store.updateItem(updated)
      expect(store.getItem(7)).toEqual(updated)
    })

    it('does nothing for non-existent id', () => {
      store.updateItem({ id: 999, parent: null, label: 'Нет' })
      expect(store.getAll()).toHaveLength(8)
    })
  })
})
