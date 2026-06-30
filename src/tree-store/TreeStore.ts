type Id = number | string

interface TreeItem {
  id: Id
  parent: Id | null
  [key: string]: unknown
}

class TreeStore {
  private items: TreeItem[]
  private itemMap: Map<Id, TreeItem>
  private childrenMap: Map<Id, TreeItem[]>

  constructor(items: TreeItem[]) {
    this.items = items
    this.itemMap = new Map()
    this.childrenMap = new Map()

    for (const item of items) {
      this.itemMap.set(item.id, item)
      if (!this.childrenMap.has(item.id)) {
        this.childrenMap.set(item.id, [])
      }
      if (item.parent !== null) {
        if (!this.childrenMap.has(item.parent)) {
          this.childrenMap.set(item.parent, [])
        }
        this.childrenMap.get(item.parent)!.push(item)
      }
    }
  }

  getAll(): TreeItem[] {
    return this.items
  }

  getItem(id: Id): TreeItem | undefined {
    return this.itemMap.get(id)
  }

  getChildren(id: Id): TreeItem[] {
    return this.childrenMap.get(id) ?? []
  }

  getAllChildren(id: Id): TreeItem[] {
    const result: TreeItem[] = []
    const stack = this.getChildren(id).slice()

    while (stack.length > 0) {
      const current = stack.pop()!
      result.push(current)
      const children = this.getChildren(current.id)
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }

    return result
  }

  getAllParents(id: Id): TreeItem[] {
    const result: TreeItem[] = []
    let current = this.itemMap.get(id)

    while (current !== undefined) {
      result.push(current)
      current = current.parent !== null ? this.itemMap.get(current.parent) : undefined
    }

    return result
  }

  addItem(item: TreeItem): void {
    this.items.push(item)
    this.itemMap.set(item.id, item)
    if (!this.childrenMap.has(item.id)) {
      this.childrenMap.set(item.id, [])
    }
    if (item.parent !== null) {
      if (!this.childrenMap.has(item.parent)) {
        this.childrenMap.set(item.parent, [])
      }
      this.childrenMap.get(item.parent)!.push(item)
    }
  }

  removeItem(id: Id): void {
    const toRemove = new Set<Id>([id, ...this.getAllChildren(id).map(item => item.id)])

    const target = this.itemMap.get(id)
    if (target?.parent !== null && target?.parent !== undefined) {
      const siblings = this.childrenMap.get(target.parent)
      if (siblings) {
        const idx = siblings.indexOf(target)
        if (idx !== -1) siblings.splice(idx, 1)
      }
    }

    for (const removeId of toRemove) {
      this.itemMap.delete(removeId)
      this.childrenMap.delete(removeId)
    }

    this.items = this.items.filter(item => !toRemove.has(item.id))
  }

  updateItem(updated: TreeItem): void {
    const existing = this.itemMap.get(updated.id)
    if (!existing) return

    if (existing.parent !== updated.parent) {
      if (existing.parent !== null) {
        const oldSiblings = this.childrenMap.get(existing.parent)
        if (oldSiblings) {
          const idx = oldSiblings.indexOf(existing)
          if (idx !== -1) oldSiblings.splice(idx, 1)
        }
      }
      if (updated.parent !== null) {
        if (!this.childrenMap.has(updated.parent)) {
          this.childrenMap.set(updated.parent, [])
        }
        this.childrenMap.get(updated.parent)!.push(updated)
      }
    }

    const idx = this.items.indexOf(existing)
    if (idx !== -1) this.items[idx] = updated

    this.itemMap.set(updated.id, updated)

    const children = this.childrenMap.get(updated.id) ?? []
    this.childrenMap.set(updated.id, children)
  }
}

export type { Id, TreeItem }
export { TreeStore }
