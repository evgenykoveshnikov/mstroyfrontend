import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore, type TreeItem } from '../services/TreeStore.ts'

describe('TreeStore', () => {
  let store: TreeStore
  const items: TreeItem[] = [
    { id: 1, parent: null, label: 'Root' },
    { id: 2, parent: 1, label: 'Child 1' },
    { id: 3, parent: 1, label: 'Child 2' },
    { id: 4, parent: 2, label: 'Grandchild' }
  ]

  beforeEach(() => {
    store = new TreeStore(items)
  })

  describe('getAll', () => {
    it('должен возвращать изначальный массив', () => {
      expect(store.getAll()).toEqual(items)
    })
  })

  describe('getItem', () => {
    it('должен возвращать элемент по id', () => {
      expect(store.getItem(1)).toEqual({ id: 1, parent: null, label: 'Root' })
      expect(store.getItem(999)).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('должен возвращать прямых детей', () => {
      expect(store.getChildren(1)).toHaveLength(2)
      expect(store.getChildren(1)?.map(item => item.id)).toEqual([2, 3])
      expect(store.getChildren(999)).toEqual([])
    })
  })

  describe('getAllChildren', () => {
    it('должен возвращать всех потомков рекурсивно', () => {
      const allChildren = store.getAllChildren(1)
      expect(allChildren).toHaveLength(3)
      expect(allChildren.map(item => item.id)).toEqual([2, 3, 4])
    })
  })

  describe('getAllParents', () => {
    it('должен возвращать цепочку родителей от корня к элементу', () => {
      const parents = store.getAllParents(4)
      expect(parents.map(item => item.id)).toEqual([1, 2, 4])
    })
  })

  describe('addItem', () => {
    it('должен добавлять новый элемент', () => {
      const newItem = { id: 5, parent: 1, label: 'New Child' }
      store.addItem(newItem)

      expect(store.getAll()).toHaveLength(5)
      expect(store.getItem(5)).toEqual(newItem)
    })
  })

  describe('removeItem', () => {
    it('должен удалять элемент и всех потомков', () => {
      store.removeItem(2)
      expect(store.getAll()).toHaveLength(2) // Root + Child 2
      expect(store.getItem(2)).toBeUndefined()
      expect(store.getItem(4)).toBeUndefined()
    })
  })
})
