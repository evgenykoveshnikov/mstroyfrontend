import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExampleGrid from '../components/exampleGrid.vue'
import { TreeStore } from '../services/TreeStore.ts'

const mockItems = [
  { id: 1, parent: null, label: 'Root' },
  { id: 2, parent: 1, label: 'Child 1' },
  { id: 3, parent: 1, label: 'Child 2' }
]

vi.mock('ag-grid-vue3', () => ({
  AgGridVue: {
    name: 'AgGridVue',
    template: '<div><slot></slot></div>',
    props: ['columnDefs', 'rowData', 'treeData', 'getDataPath', 'getRowId']
  }
}))

describe('ExampleGrid', () => {
  let wrapper: any
  let treeStore: TreeStore

  beforeEach(() => {
    treeStore = new TreeStore(mockItems)
    wrapper = mount(ExampleGrid, {
      props: {
        store: treeStore
      },
      global: {
        plugins: [],
        stubs: {
          AgGridVue: true
        }
      }
    })
  })

  it('рендерится корректно', () => {
    expect(wrapper.exists()).toBe(true)
  })



  it('getDataPath возвращает правильные пути', () => {
    const getDataPath = wrapper.vm.getDataPath(mockItems[1])
    expect(getDataPath).toEqual(['1', '2'])
  })

  it('getRowId возвращает строковое id', () => {
    const getRowId = wrapper.vm.getRowId({ data: { id: 1 } })
    expect(getRowId).toBe('1')
  })
})
