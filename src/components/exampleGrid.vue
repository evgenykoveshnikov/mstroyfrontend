<template>
  <div>
    <ag-grid-vue  :theme="themeAlpine" style="width: 100%; height: 500px" :columnDefs="columnsDefs" :rowData="rootItems" :treeData="true" :getDataPath="getDataPath" :getRowId="getRowId" :defaultColDef="defaultColDef" :autoGroupColumnDef="autoGroupColumnDef" :getRowClass="getRowClass" @grid-ready="onGridReady"/>
    {{props.store}}
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {AgGridVue} from "ag-grid-vue3";
import {themeAlpine} from "ag-grid-enterprise";
import 'ag-grid-enterprise'
import type {
  ColDef,
  GridReadyEvent,
  GetRowIdParams,
  RowClassParams,
} from "ag-grid-community";
import { TreeStore} from "../services/TreeStore.ts";
import type{TreeItem, ItemId} from "../services/TreeStore.ts";

interface IProps {
  store: TreeStore;
}

const props = defineProps<IProps>();

const columnsDefs = ref<ColDef[]>([
  {
    headerName: '№ п/п',
    width: 10,
    pinned: 'left',
    valueGetter: 'node.rowIndex + 1',
    sortable: false,
    filter: false
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 2,
    cellStyle: { textAlign: 'left' },
  },
])

const defaultColDef = ref({
  resizable: true,
  sortable: true,
})

const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  width : 100,
  field: '_category',
  cellRenderer: 'agGroupCellRenderer',
  valueGetter: (params) => {
    const children = props.store?.getChildren(params.data.id)
    return children?.length > 0 ? 'Группа' : 'Элемент'
  },
  cellRendererParams: {
    suppressCount: true,
  }

}

const rootItems = computed(() => {
  const roots =  props.store?.getAll() || []
  return roots
})

const getDataPath = (data: TreeItem): string[] => {

  const path: string[] = []
  let currentId: ItemId | null = data.parent

  while (currentId !== null) {
    const parent = props.store.getItem(currentId)

    if (!parent) break
    path.unshift(String(parent.id))
    currentId = parent.parent
  }

  path.push(String(data.id))

  return path
}


const getRowId = (params: GetRowIdParams) => {
  return String(params.data.id)
}

const getRowClass = (params: RowClassParams) => {
  return params.node.level === 0 ? 'level-0' : `level-${params.node.level}`
}

let gridApi: any = null

const onGridReady = (params: GridReadyEvent) => {
  gridApi = params.api
  gridApi.sizeColumnsToFit()
}

// Обновление при изменении store
watch(() => props.store, () => {
  if (gridApi) {
    gridApi.setGridOption('rowData', rootItems.value)
  }
}, { deep: true })


</script>